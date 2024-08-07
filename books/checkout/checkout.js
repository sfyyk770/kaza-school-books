$(document).ready(function() {
    // let orderData = JSON.parse(localStorage.getItem('orderData') ?? '{"children":[{"name":"kjnkfdvd","school":"roosevelt-high","grade":"2"}],"cart":[{"id":203,"title":"Our Planet Earth","price":26.99,"child":"kjnkfdvd"},{"id":202,"title":"Reading Comprehension: Grade 2","price":17.99,"child":"kjnkfdvd"}]}');
    let orderData = JSON.parse(localStorage.getItem('orderData'));
    const TAX_RATE = 0.08875; // 8.875%
    let SUBTOTAL = 0;
    let TOTAL = 0;

    // Function to update the order summary content
    function updateOrderSummary() {
      const orderSummaryContent = $('#order-summary-content');
      orderSummaryContent.empty(); // Clear previous content

      let subtotal = 0;

      orderData.children.forEach(child => {
        const childOrder = $('<div class="child-order"></div>');
        childOrder.append(`<div class="child-name">${child.name} - ${child.grade} Grade</div>`);

        const cartItems = orderData.cart.filter(item => item.child === child.name);
        cartItems.forEach(item => {
          const orderItem = $('<div class="order-item"></div>');
          orderItem.append(`<span>${item.title}</span>`);
          orderItem.append(`<span>$${item.price.toFixed(2)}</span>`);
          childOrder.append(orderItem);
          subtotal += parseFloat(item.price);
        });
        SUBTOTAL =+ subtotal;
        childOrder.append(`<div class="child-subtotal">Subtotal: $${subtotal.toFixed(2)}</div>`);
        orderSummaryContent.append(childOrder);
        subtotal = 0; // Reset subtotal for the next child
      });
    }

    $('.payment-option').click(function() {
      $('.payment-option').removeClass('selected');
      $(this).addClass('selected');
      
      if ($(this).attr('id') === 'credit-card-option') {
        $('#credit-card-form').show();
        $('#phone-payment-info').hide();
      } else {
        $('#credit-card-form').hide();
        $('#phone-payment-info').show();
      }
    });

    $('.shipping-option').click(function() {
      $('.shipping-option').removeClass('selected');
      $(this).addClass('selected');
      updateTotal();
    });

    function updateTotal() {
      let tax = SUBTOTAL * TAX_RATE;
      let shippingCost = Number($('#shipping-cost-value').val()) ?? 0;
      TOTAL = SUBTOTAL + tax + shippingCost;

      $('#tax-amount').text('$' + tax.toFixed(2));
    //   $('#shipping-cost').text('$' + shippingCost.toFixed(2));
      $('#total-cost').text('$' + TOTAL.toFixed(2));
    }

    $('#shipping-payment-form').submit(function(e) {
      e.preventDefault();

      // Get form data
      const name = $('#name').val(), email = $('#email').val(), phone = $('#phone').val(), zip = $('#zip').val(), address = $('#address').val(), city = $('#city').val(), state = $('#state').val();
      const paymentMethod = $('.payment-option.selected').attr('id');

      // Create form data object
      const formData = { name, email, phone, zip, address, city, state, paymentMethod, total: TOTAL.toFixed(2) };

      // Get existing orderData from localStorage
      let orderData = JSON.parse(localStorage.getItem('orderData'));

      // Add form data to orderData
      orderData.formData = formData;

      // Update orderData in localStorage
      localStorage.setItem('orderData', JSON.stringify(orderData));

      // Generate order number
      let orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      $('#order-number').text(orderNumber);
      $('#confirm-email').text($('#email').val());
      $('#thank-you-modal').css('display', 'block');
    });

    $('.close').click(function() {
      $('#thank-you-modal').css('display', 'none');
    });

    $(window).click(function(event) {
      if (event.target == document.getElementById('thank-you-modal')) {
        $('#thank-you-modal').css('display', 'none');
      }
    });


    // Function to update the shipping cost display
    function updateShippingCost() {
        const selectedOption = document.querySelector('.shipping-option.selected');
        const shippingCostValue = selectedOption.dataset.cost;
        const shippingCostLabel = shippingCostValue === '0' ? 'Free' : `$${shippingCostValue}`;

        $('#shipping-cost-value').val(shippingCostValue);
        $('#shipping-cost-label').text(shippingCostLabel);
        if (shippingCostValue === 0) $('#order-shipping').css('display', 'none');
        updateTotal();
    }
    
    // Call the function initially to set the default shipping cost
    updateShippingCost();
    
    // Add an event listener to update the shipping cost when a shipping option is selected
    document.querySelectorAll('.shipping-option').forEach(option => {
        option.addEventListener('click', () => {
            updateShippingCost();
        });
    });




    // Get Shipping Rates from Shippo API
    async function getShippoRates() {
      const apiKey = 'shippo_test_52d6e839a189865c78c74ea6ad7d6e91d3ec7383';
      const apiUrl = 'https://api.goshippo.com/v1/shipments/';

      const shipmentData = {
        address_from: {
          name: 'John Doe',
          street1: '329 Kingston Avenue',
          city: 'New York',
          state: 'NY',
          zip: '11213',
          country: 'US'
        },
        address_to: {
          name: 'Jane Doe',
          street1: '456 Elm St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US'
        },
        parcels: [{
          length: '5',
          width: '5',
          height: '5',
          distance_unit: 'in',
          weight: '2',
          mass_unit: 'lb'
        }]
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `ShippoToken ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(shipmentData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.rates);
        return data.rates;
        
      } catch (error) {
        console.error('Error fetching Shippo rates:', error);
        return null;
      }
    }
    getShippoRates();

    // Initial update
    updateOrderSummary();
    updateTotal();
  });