<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Log;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller {
    // Function to add new bookings to the database
    function addBooking(Request $request) {
        $this -> validate($request, [
            'fName' => 'required',
            'lName' => 'required',
            'roomType' => 'required',
            'roomNumber' => 'required',
            'email' => 'required',
            'idCard' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'required',
            'zipCode' => 'required',
            'amount' => 'required',
            'checkInDate' => 'required',
            'checkOutDate' => 'required',
        ]);

        $data = $request -> all();
        // Adding default data
        $data['paidAmount'] = 0;
        $data['deposit'] = 0;
        $data['checkedIn'] = false;
        $data['checkedOut'] = false;

        Booking::create($data);
        return redirect('/bookings#bookings-table');
    }

    public function editBooking(Request $request, $id)
    {
        $request->validate([
            'paidamount' => 'required',
            'deposit' => 'required',
        ]);

        $booking = Booking::find($id);
        $booking->paidamount = $request->paidamount;
        $booking->deposit = $request->deposit;
        $booking->checkedin = $request->has('checkedin');
        $booking->checkedout = $request->has('checkedout');
        $booking->save();

        return redirect()->route('viewBookings')->with('success', 'Booking updated successfully.');
    }
    
    function deleteBooking(Request $request) {
        $data = Booking::find($request -> id);
        $data -> delete();

        if (Auth::user() -> can('isAdmin')) {
            return redirect('/adminBooking#bookings-table');
        } else {
            return redirect('/bookings#bookings-table');
        }
    }
    
    function viewBookings(){
        $data = Booking::paginate(5);

        if (Auth::user() -> can('isAdmin')) {
            return view('/adminBooking', ['bookings' => $data]);
        } else {
            return view('/bookings', ['bookings' => $data]);
        }
    }

    function viewBookingDetails($id){
        try {
            $bookingDetails = Booking::where('id', $id) -> first();
            return response() -> json($bookingDetails);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response() -> json(['error' => 'Something went wrong.'], 500);
        }
    }

}
