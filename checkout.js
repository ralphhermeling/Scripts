    
    var dg$;
    var script = document.createElement('script');
    script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    var selected_script = document.querySelector('script[src*="https://s.pinimg.com/ct/core.js"]');
	
    if(selected_script){

        script.addEventListener('load', function () {
            dg$ = $.noConflict(true);
           
            mainScript(dg$);
        });
        document.head.appendChild(script);
        
        function ajaxCheckout($, cart_url, fbTrackCode, currency) {
            $.ajax({
                url: cart_url,
                dataType: 'jsonp',
                header: {
                    'Access-Control-Allow-Origin': '*'
                },
                success: function (response) {
                    contentIDs = [];
                    $.each(response.items, function (index, value) {
                        contentIDs.push(value.product_id);
                    });
                    var total_price = Shopify.formatMoney(response.total_price);
                    total_price = total_price.replace(/[^0-9.]/g, '');
                    
                    var checkoutPixel = "fbq('track', 'InitiateCheckout',{ content_type: 'product_group', content_ids: [" + contentIDs + "], num_items: " + response.item_count + ", currency: '" + currency + "',value: " + total_price + "});";
                    
                    $('head').append("<script>" + fbTrackCode + "" + checkoutPixel);
                }
            });
        }
        
        function mainScript($) {
            var selected_script = document.querySelector('script[src*="https://s.pinimg.com/ct/core.js"]');
            if(selected_script){
            var showPixel = showImgPixel = showImgPixel2 = '';
            
            var pageURL = window.location.href;
            
            var cart_url = '//' + window.location.hostname + '/cart.json';
            
            var content_ids = [], product_ids = [], line_itemsLen, total_price, cur;
            line_itemsLen = $('[data-order-summary-section="line-items"] tr').length;
            
            total_price = $('.payment-due__price').text();
            
            if (total_price.indexOf('Rs.') > -1) {
                total_price = total_price.replace('Rs.', '');
            }
            if (total_price.indexOf('Dhs.') > -1) {
                total_price = total_price.replace('Dhs.', '');
            }
            
            cur = total_price.replace(/[^0-9$€£.]/g, '').charAt(0);
            total_price = total_price.replace(/[^0-9.]/g, '');
            var checkTotal = $('.payment-due__price').attr('data-checkout-payment-due-target');
            $('[data-order-summary-section="line-items"] tr').each(function () {
                product_ids.push($(this).attr('data-product-id'));
                content_ids.push($(this).attr('data-variant-id'));
            });
            
            
            if (checkTotal == total_price) {
                total_price = total_price.split('');
                total_price.splice(-2, 0, '.');
                total_price = total_price.join('');
            }
            
            if (cur == '€') {
                cur = 'EUR';
            }
            if (cur == '$') {
                cur = 'USD';
            }
            if (cur == '£') {
                cur = 'GBP';
            }
            
            var order_id = '';
            order_id = $('.os-order-number').text();
            order_id = order_id.replace(/[^0-9.]/g, '');
            
            showImgPixel = "<img height='1' width='1' style='display:none;' alt='' src='https://ct.pinterest.com/v3/?tid=2614349527611&noscript=1' /> ";
            
            var script = document.createElement("script");
            var noscript = document.createElement("noscript");
            script.type = "text/javascript";
            script.innerHTML = "!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version='3.0';var t=document.createElement('script');t.async=!0,t.src=e;var r=document.getElementsByTagName('script')[0];r.parentNode.insertBefore(t,r)}}('https://s.pinimg.com/ct/core.js');pintrk('page');";
            noscript.innerHTML = showImgPixel;
            document.head.appendChild(script);
            document.head.appendChild(noscript);
            
            showImgPixel2 = "<img height='1' width='1' style='display:none;' alt='' src='https://ct.pinterest.com/v3/?tid=2614349527611&event=checkout&noscript=1'/>";
            
            var script2 = document.createElement("script");
            var noscript2 = document.createElement("noscript");
            script2.type = "text/javascript";
            script2.innerHTML = "pintrk('track', 'checkout',{value: "+total_price+",currency: '"+cur+"',order_quantity: "+line_itemsLen+",order_id: '"+order_id+"'});";
            
            noscript2.innerHTML = showImgPixel;
            document.head.appendChild(script2);
            document.head.appendChild(noscript2);
        }
        }
    }
        
