var next_click = document.querySelectorAll(".next_button");
var main_form = document.querySelectorAll(".main");
var step_list = document.querySelectorAll(".progress-bar li");
var num = document.querySelector(".step-number");
let formnumber = 0;

next_click.forEach(function (next_click_form) {
    next_click_form.addEventListener('click', function () {
        // if (!validateform()) {
        //     return false
        // }
        formnumber++;
        updateform();
        progress_forward();
        contentchange();
    });
});

var back_click = document.querySelectorAll(".back_button");
back_click.forEach(function (back_click_form) {
    back_click_form.addEventListener('click', function () {
        formnumber--;
        updateform();
        progress_backward();
        contentchange();
    });
});

var username = document.querySelector("#user_name");
var shownname = document.querySelector(".shown_name");



var submit_click = document.querySelectorAll(".submit_button");
submit_click.forEach(function (submit_click_form) {  
    submit_click_form.addEventListener('click', function () {
        if (!validateform()) {
            return false;
        }

        // Disable the submit button to prevent further clicks
        submit_click_form.disabled = true;
        submit_click_form.innerHTML = 'Submitting...';

        // Add dots animation to the "Submitting" label
        var dots = document.querySelector('.dots');
        var dotCount = 1;
        var dotInterval = setInterval(function() {
            dotCount = (dotCount % 3) + 1;
            dots.innerHTML = '.'.repeat(dotCount);
        }, 500); // Add dots every 0.5 seconds

        data = {};
        data["fullname"] = $("#fullname").val();
        data["amount"] = $("#amount").val();
        data["country"] = $("#country").val();
        data["address"] = $("#address").val();
        console.log(data);

        // Submit the form via AJAX
        $.post("api/donate", data, function (res) {
            console.log(res);
            clearInterval(dotInterval); // Stop the dot animation
            if (res.error === false) {
                window.location.href = res.link;
            } else {
                alert('Something went wrong. Please try again.');
                // Re-enable the button if submission fails
                submit_click_form.disabled = false;
                submit_click_form.innerHTML = 'Submit';
            }
        }).fail(function(xhr) {
            alert('Error connecting to server. Please try again.');
            // Re-enable the button if submission fails
            submit_click_form.disabled = false;
            submit_click_form.innerHTML = 'Submit';
        });
    });
});

function updateform() {

    main_form.forEach(function (mainform_number) {
        mainform_number.classList.remove('active');
    })
    main_form[formnumber].classList.add('active');
}

function progress_forward() {
    step_list.forEach(list => {
        list.classList.remove('active');

    }); 
    num.innerHTML = formnumber + 1;
    step_list[formnumber].classList.add('active');
}

function progress_backward() {
    var form_num = formnumber + 1;
    step_list[form_num].classList.remove('active');
    step_list[formnumber].classList.add('active');

    num.innerHTML = form_num;
}

var step_num_content = document.querySelectorAll(".step-number-content");

function contentchange() {
    step_num_content.forEach(function (content) {
        content.classList.remove('active');
        content.classList.add('d-none');
    });
    step_num_content[formnumber].classList.add('active');
}


function validateform() {
    var validate = true;
    var validate_inputs = document.querySelectorAll("input, select");

    validate_inputs.forEach(function(validate_input) {
        // Remove previous warning styles
        validate_input.classList.remove('warning');
        
        // Check for required fields
        if (validate_input.hasAttribute('required')) {
            if (validate_input.value.trim().length == 0) {
                validate = false;
                validate_input.classList.add('warning');
            }
        }

        // Special validation for the amount field (ensuring it's a number)
        if (validate_input.id === 'amount') {
            var amountValue = validate_input.value.trim();
            // Check if the amount is a valid number (positive and not text)
            if (isNaN(amountValue) || amountValue < 500) {
                validate = false;
                validate_input.classList.add('warning');
                alert('Amount must be a positive number and atleast 500 TZS.');
            }
        }
    });

    return validate;
}
