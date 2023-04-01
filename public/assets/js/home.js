var input = document.querySelector("#phone");
window.intlTelInput(input, {});

function filterRooms() {
    // Get the selected room type
    const roomType = document.getElementById("roomtype").value;

    // Get the room number select box and clear its options
    const roomNumberSelect = document.getElementById("roomnumber");
    roomNumberSelect.innerHTML = "";

    // If the selected room type is "single", show room numbers S001 to S010
    if (roomType === "single") {
        for (let i = 1; i <= 10; i++) {
            const roomNumber = i < 10 ? `SI00${i}` : `SI010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    }

    // If the selected room type is "double", show room numbers D001 to D010
    else if (roomType === "double") {
        for (let i = 1; i <= 10; i++) {
            const roomNumber = i < 10 ? `DO00${i}` : `DO010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    } else if (roomType === "triple") {
        for (let i = 1; i <= 5; i++) {
            const roomNumber = i < 10 ? `TR00${i}` : `TRO010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    } else if (roomType === "queen") {
        for (let i = 1; i <= 10; i++) {
            const roomNumber = i < 10 ? `QU00${i}` : `QUO010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    } else if (roomType === "king") {
        for (let i = 1; i <= 10; i++) {
            const roomNumber = i < 10 ? `KI00${i}` : `KI010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    } else if (roomType === "studio") {
        for (let i = 1; i <= 10; i++) {
            const roomNumber = i < 10 ? `ST00${i}` : `ST010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    } else if (roomType === "executive") {
        for (let i = 1; i <= 3; i++) {
            const roomNumber = i < 10 ? `ES00${i}` : `ES010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    } else if (roomType === "presidential") {
        for (let i = 1; i <= 3; i++) {
            const roomNumber = i < 10 ? `PS00${i}` : `PS010`;
            const option = document.createElement("option");
            option.text = roomNumber;
            option.value = roomNumber;
            roomNumberSelect.add(option);
        }
    }

    // Show the room number select box
    roomNumberSelect.style.display = "block";
}


function getLockedDays(roomNumber) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const lockedDays = [];

    bookings.forEach((booking) => {
      if (booking.roomNumber === roomNumber) {
        const checkInDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);

        for (let d = checkInDate; d < checkOutDate; d.setDate(d.getDate() + 1)) {
          lockedDays.push(new Date(d).toISOString().split("T")[0]);
        }
      }
    });
    return lockedDays;
}

/* -------------------- Checkindate & Checkoutdate & PopUp----------------------------------  */
    // Run the code inside this function when the DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
    // Get references to the check-in and check-out date input fields
    const checkinDateInput = document.getElementById("checkindate");
    const checkoutDateInput = document.getElementById("checkoutdate");

    const initialRoomNumber = document.getElementById("roomnumber").options[0]?.value || "";
    const initialLockedDays = getLockedDays(initialRoomNumber);
    const picker = new Litepicker({
        element: checkinDateInput,
        elementEnd: checkoutDateInput,
        singleMode: false,
        numberOfMonths: 2,
        numberOfColumns: 2,
        format: "YYYY-MM-DD",
        minDate: new Date(),
        lockDays: initialLockedDays,
        tooltipText: {
        one: "night",
        other: "days",
        },
    });

    // update total nights when the user selects a date
    picker.on("selected", () => {
        updateTotalNights();
    });

    // Calculate the total number of nights between the check-in and check-out dates
    function updateTotalNights() {
            const checkinDate = new Date(checkinDateInput.value);
            const checkoutDate = new Date(checkoutDateInput.value);
            const totalNights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

            if (!isNaN(totalNights) && totalNights > 0) {
                const roomType = document.getElementById("roomtype").value;
                let price;

                if (roomType === "single") {
                    price = 150;
                } else if (roomType === "double") {
                    price = 250;
                }else if (roomType === "triple") {
                    price = 350;
                }else if (roomType === "queen") {
                    price = 250;
                }else if (roomType === "king") {
                    price = 300;
                }else if (roomType === "studio") {
                    price = 400;
                }else if (roomType === "executive") {
                    price = 600;
                }else if (roomType === "presidential") {
                    price = 1000;
                }

                const amount = price * totalNights;

                document.getElementById("stays").textContent = `Total Stays: ${totalNights} nights`;
                document.getElementById("prices").textContent = `Prices: $${price} x ${totalNights} nights`;
                document.getElementById("amount").textContent = `Total Amount: $${amount}`;
            } else {
                document.getElementById("stays").textContent = "Total Stays:";
                document.getElementById("prices").textContent = "Prices:";
                document.getElementById("amount").textContent = "Total Amount:";
            }
        }

        function handleFormSubmit(e) {
            e.preventDefault();

            const roomNumber = roomnumber.value;
            const checkInDate = checkindate.value;
            const checkOutDate = checkoutdate.value;
            const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

            const hasExistingBooking = bookings.some((booking) =>
                booking.roomNumber === roomNumber &&
                ((checkInDate >= booking.checkInDate &&
                checkInDate < booking.checkOutDate) ||
                (checkOutDate > booking.checkInDate &&
                    checkOutDate <= booking.checkOutDate))
            );

            if (hasExistingBooking) {
                alert("This room is already booked for the selected dates.");
            return;
            }

            document.getElementById("popup-name").textContent = `Customer Name: ${fname.value} ${lname.value}`;
            document.getElementById("popup-roomtype").textContent = `Room Type: ${roomtype.value.charAt(0).toUpperCase() + roomtype.value.slice(1)}`;
            document.getElementById("popup-roomnumber").textContent = `Room Number: ${roomnumber.value}`;
            document.getElementById("popup-checkindate").textContent = `Check In: ${checkinDateInput.value}`;
            document.getElementById("popup-checkoutdate").textContent = `Check Out: ${checkoutDateInput.value}`;
            document.getElementById("popup-stays").textContent = document.getElementById("stays").textContent;
            document.getElementById("popup-prices").textContent = document.getElementById("prices").textContent;
            document.getElementById("popup-amount").textContent = document.getElementById("amount").textContent;
            document.getElementById("overlay").style.display = "block";
        }

        // Inside the handleConfirm function
        function handleConfirm() {
            const totalStaysText = document.getElementById("stays").textContent;
            const pricesText = document.getElementById("prices").textContent;
            const amountText = document.getElementById("amount").textContent;

            const totalStays = parseInt(totalStaysText.match(/(\d+)/)[0], 10);
            const prices = parseInt(pricesText.match(/\$(\d+)/)[1], 10);
            const amount = parseInt(amountText.match(/\$(\d+)/)[1], 10);
            const phoneNumber = phone.value.replace('+', '');

            const newBooking = {
                fName: fname.value,
                lName: lname.value,
                idCard: idcard.value,
                emailAddress: email.value,
                phoneNumber,
                residentialAddress: residentialaddress.value,
                city: city.value,
                zipCode: zipcode.value,
                bookingId: Date.now().toString(),
                roomNumber: roomnumber.value,
                roomType: roomtype.value,
                checkInDate: checkindate.value,
                checkOutDate: checkoutdate.value,
                totalStays,
                prices,
                amount,
            };

            // Retrieve existing bookings from local storage or create a new array
            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

            // Add the new booking to the array and save it to local storage
            bookings.push(newBooking);
            localStorage.setItem("bookings", JSON.stringify(bookings));

            picker.setOptions({ lockDays: getLockedDays(roomnumber.value) });

            // Redirect to view.html
            window.location.href = "bookings";
        }

        function handleCancel() {
            document.getElementById("overlay").style.display = "none";
        }

        // Add event listeners to the form and confirmation buttons
        document.getElementById("submitForm").addEventListener("submit", handleFormSubmit);
        document.getElementById("confirmBtn").addEventListener("click", handleConfirm);
        document.getElementById("cancelBtn").addEventListener("click", handleCancel);
        document.getElementById("roomnumber").addEventListener("change", () => {
            const roomNumber = document.getElementById("roomnumber").value;
            const lockedDays = getLockedDays(roomNumber);
            picker.setOptions({ lockDays: lockedDays });
        });
    });