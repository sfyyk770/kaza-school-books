$(document).ready(function() {
    let children = [];
    let cart = [];
    
    const defaultBookImage = "https://via.placeholder.com/200x300.png?text=Book+Cover";
    
    const booksByGrade = {
      '1': [
        {id: 101, title: "First Grade Math", price: 19.99, image: defaultBookImage},
        {id: 102, title: "Learn to Read: Level 1", price: 14.99, image: defaultBookImage},
        {id: 103, title: "Science for Beginners", price: 24.99, image: defaultBookImage},
        {id: 104, title: "My First Art Book", price: 12.99, image: defaultBookImage},
        {id: 105, title: "Early Social Studies", price: 22.99, image: defaultBookImage}
      ],
      '2': [
        {id: 201, title: "Second Grade Math", price: 22.99, image: defaultBookImage},
        {id: 202, title: "Reading Comprehension: Grade 2", price: 17.99, image: defaultBookImage},
        {id: 203, title: "Our Planet Earth", price: 26.99, image: defaultBookImage},
        {id: 204, title: "Art and Crafts: Level 2", price: 15.99, image: defaultBookImage},
        {id: 205, title: "American History for Kids", price: 23.99, image: defaultBookImage}
      ],
      '3': [
        {id: 301, title: "Third Grade Math", price: 24.99, image: defaultBookImage},
        {id: 302, title: "Advanced Reading: Grade 3", price: 19.99, image: defaultBookImage},
        {id: 303, title: "Exploring Nature", price: 28.99, image: defaultBookImage},
        {id: 304, title: "Music Fundamentals", price: 18.99, image: defaultBookImage},
        {id: 305, title: "World Cultures for Children", price: 25.99, image: defaultBookImage}
      ],
      '4': [
        {id: 401, title: "Fourth Grade Math", price: 26.99, image: defaultBookImage},
        {id: 402, title: "Literature Studies: Grade 4", price: 21.99, image: defaultBookImage},
        {id: 403, title: "Human Body Systems", price: 29.99, image: defaultBookImage},
        {id: 404, title: "Introduction to Coding", price: 27.99, image: defaultBookImage},
        {id: 405, title: "Geography for Kids", price: 24.99, image: defaultBookImage}
      ],
      '5': [
        {id: 501, title: "Fifth Grade Math", price: 28.99, image: defaultBookImage},
        {id: 502, title: "Advanced Literature: Grade 5", price: 23.99, image: defaultBookImage},
        {id: 503, title: "Earth and Space Science", price: 31.99, image: defaultBookImage},
        {id: 504, title: "Creative Writing Workshop", price: 20.99, image: defaultBookImage},
        {id: 505, title: "World History: Ancient Civilizations", price: 27.99, image: defaultBookImage}
      ]
    };
    
    // Load data from localStorage on page load
    const storedData = JSON.parse(localStorage.getItem('orderData'));
    if (storedData && storedData.children && storedData.cart) {
      children = storedData.children;
      cart = storedData.cart;
    }
    
    $('#open-add-child-form').click(function() {
      $('#add-child-form, .overlay').fadeIn();
    });
    
    $('.close-form, .overlay').click(function() {
      $('#add-child-form, .overlay').fadeOut();
    });
    
    $('#add-child').click(function() {
      const name = $('#child-name').val();
      const school = $('#school-select').val();
      const grade = $('#grade-select').val();
      
      if (name && school && grade) {
        children.push({name, school, grade});
        updateChildrenList();
        $('#child-name').val('');
        $('#school-select').val('');
        $('#grade-select').val('');
        $('#add-child-form, .overlay').fadeOut();
      } else {
        alert('Please fill in all fields for the child.');
      }
    });
    
    function updateChildrenList() {
      let childrenHTML = '';
      if (children.length === 0) {
        childrenHTML = `
          <div class="empty-state fade-in">
            <i class="fas fa-child"></i>
            <h3>No Children Added Yet</h3>
            <p>Add a child to get started!</p>
          </div>
        `;
      } else {
        children.forEach((child, index) => {
          childrenHTML += `
            <div class="child-info fade-in">
              <div class="child-header">
                <div class="child-details">
                  <h3>${child.name}</h3>
                  <p><i class="fas fa-school child-info-icon"></i> School: ${child.school}</p>
                  <p><i class="fas fa-graduation-cap child-info-icon"></i> Grade: ${child.grade}</p>
                  <p><i class="fas fa-list-ol child-info-icon"></i> Books: ${child.booksCount ?? 0}</p>
                </div>
                <div class="child-actions">
                  <button class="btn toggle-books" data-index="${index}"><i class="fas fa-book"></i> Load Books</button>
                  <div class="view-toggle">
                    <button class="grid-view active"><i class="fas fa-th"></i> Grid</button>
                    <button class="list-view"><i class="fas fa-list"></i> List</button>
                  </div>
                </div>
              </div>
              <div class="child-books" id="child-books-${index}"></div>
            </div>
          `;
        });
      }
      $('#children-list').html(childrenHTML);
      // Update cart after children list is updated
      updateCart();
    }
    
    $(document).on('click', '.toggle-books', function() {
      const childIndex = $(this).data('index');
      const $childBooks = $(`#child-books-${childIndex}`);
      const $button = $(this);
      
      if ($childBooks.hasClass('active')) {
        $childBooks.removeClass('active');
        $button.html('<i class="fas fa-book"></i> Load Books');
      } else {
        const child = children[childIndex];
        const books = booksByGrade[child.grade];
        
        let bookHTML = '<div class="book-list">';
        books.forEach(book => {
          const isInCart = cart.some(item => item.id === book.id && item.child === child.name);
          bookHTML += `
            <div class="book fade-in">
              <img src="${book.image}" alt="${book.title}" class="book-image">
              <div class="book-info">
                <h3>${book.title}</h3>
                <p>$${book.price}</p>
                <button class="btn ${isInCart ? 'btn-remove' : ''} add-to-cart" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}" data-child="${child.name}">
                  <i class="fas ${isInCart ? 'fa-trash-alt' : 'fa-cart-plus'}"></i> ${isInCart ? 'Remove' : 'Add'}
                </button>
              </div>
            </div>
          `;
        });
        bookHTML += '</div>';
        
        $childBooks.html(bookHTML).addClass('active');
        $button.html('<i class="fas fa-book"></i> Hide Books');
      }
      
      $(this).closest('.child-info').find('.view-toggle').toggleClass('active');
    });
    
    $(document).on('click', '.add-to-cart', function() {
      const book = {
        id: $(this).data('id'),
        title: $(this).data('title'),
        price: $(this).data('price'),
        child: $(this).data('child')
      };
      
      const existingBookIndex = cart.findIndex(item => item.id === book.id && item.child === book.child);
      
      if (existingBookIndex === -1) {
        cart.push(book);
        $(this).addClass('btn-remove');
        $(this).html('<i class="fas fa-trash-alt"></i> Remove');
      } else {
        cart.splice(existingBookIndex, 1);
        $(this).removeClass('btn-remove');
        $(this).html('<i class="fas fa-cart-plus"></i> Add');
      }
      
      updateCart();
    });
    
    function updateCart() {
      let cartHTML = '';
      let total = 0;
      
      if (cart.length === 0) {
        $('#cart').hide();
      } else {
        $('#cart').show();
        const childTotals = {};
        cart.forEach(item => {
          if (!childTotals[item.child]) {
            childTotals[item.child] = 0;
          }
          childTotals[item.child] += parseFloat(item.price);
          total += parseFloat(item.price);
        });
        
        Object.keys(childTotals).forEach(child => {
          cartHTML += `
            <li class="cart-child-total">
              <div class="cart-child-name">${child}'s Books - $${childTotals[child].toFixed(2)}</div>
              <ul class="cart-child-items">
                ${cart.filter(item => item.child === child).map(item => `
                  <li>${item.title} - <span class="cart-child-price">$${parseFloat(item.price).toFixed(2)}</span></li>
                `).join('')}
              </ul>
            </li>
          `;
        });
      }
      
      $('#cart-items').html(cartHTML);
      $('#cart-total').text(total.toFixed(2));
    }
    
    $(document).on('click', '.cart-child-total', function() {
      $(this).toggleClass('active');
      $(this).find('.cart-child-items').toggleClass('active');
      $(this).find('.cart-child-name').toggleClass('active');
    });
    
    $('#checkout').click(function() {
      if (cart.length > 0) {
        // alert('Thank you for your order! Total: $' + $('#cart-total').text());
        // cart = [];
        // updateCart();
        localStorage.setItem('orderData', JSON.stringify({ children, cart }));
        window.location.href = 'checkout';
        $('.add-to-cart').removeClass('btn-remove').html('<i class="fas fa-cart-plus"></i> Add');
      } else {
        alert('Your cart is empty. Please add some books before checking out.');
      }
    });
    
    $(document).on('click', '.grid-view', function() {
      $(this).addClass('active');
      $(this).siblings('.list-view').removeClass('active');
      $(this).closest('.child-info').find('.book-list').removeClass('list-mode');
    });
    
    $(document).on('click', '.list-view', function() {
      $(this).addClass('active');
      $(this).siblings('.grid-view').removeClass('active');
      $(this).closest('.child-info').find('.book-list').addClass('list-mode');
    });
    
    // Initialize the children list
    updateChildrenList();
    // Initialize the cart
    updateCart();

    // Force list mode on mobile
    function checkMobileAndSetListMode() {
      if (window.innerWidth <= 768) {
        $('.book-list').addClass('list-mode');
        $('.list-view').addClass('active');
        $('.grid-view').removeClass('active');
      } else {
        $('.book-list').removeClass('list-mode');
        $('.grid-view').addClass('active');
        $('.list-view').removeClass('active');
      }
    }

    // Run on page load and window resize
    checkMobileAndSetListMode();
    $(window).resize(checkMobileAndSetListMode);

  });
  
  
  $(document).ready(function() {
    // Function to handle dropdown clicks
    function handleDropdownClick(dropdownId) {
      const dropdownButton = $(`#${dropdownId} .dropdown-button`);
      const dropdownList = $(`#${dropdownId} .dropdown-list`);
      const customDropdown = $(`#${dropdownId}`);

      dropdownButton.on('click', () => {
        customDropdown.toggleClass('open');
      });

      dropdownList.on('click', (event) => {
        if (event.target.tagName === 'LI') {
          const selectedValue = event.target.dataset.value;
          // const selectedLogo = event.target.dataset.logo;

          // Update the selected school text
          dropdownButton.find('.selected-school').text(event.target.textContent);

          // Update the school-select input value
          const schoolSelect = $(`#${dropdownId} input[type="hidden"]`);
          schoolSelect.val(selectedValue);

          // Update the school logo TOFIX
          // const schoolLogo = dropdownButton.find('.school-logo');
          // if (selectedLogo) {
          //   schoolLogo.attr('src', selectedLogo);
          //   schoolLogo.show();
          // } else {
          //   schoolLogo.hide();
          // }

          // Close the dropdown
          customDropdown.removeClass('open');
        }
      });

      // Close the dropdown when clicking outside of it
      $(document).on('click', (event) => {
        if (!customDropdown.is(event.target) && customDropdown.has(event.target).length === 0) {
          customDropdown.removeClass('open');
        }
      });
    }

    // Call the function for each dropdown
    // handleDropdownClick('custom-dropdown-1');
    // handleDropdownClick('custom-dropdown-2');
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
      handleDropdownClick(dropdown.id);
    });
  });