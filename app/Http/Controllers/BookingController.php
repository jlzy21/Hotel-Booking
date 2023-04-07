<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function createBooking(Request $request)
    {
        $validatedData = $request->validate([
            'fname' => 'required',
            'lname' => 'required',
            'roomtype' => 'required',
            'roomnumber' => 'required',
            'email' => 'required',
            'idcard' => 'required',
            'phone' => 'required',
            'residentialaddress' => 'required',
            'city' => 'required',
            'zipcode' => 'required',
            'amount' => 'required',
            'checkindate' => 'required',
            'checkoutdate' => 'required',
        ]);

        $booking = new Booking;
        $booking->fill($validatedData);
        $booking->checkedin = false;
        $booking->checkedout = false;
        $booking->paidamount = 0;
        $booking->deposit = 0;
        $booking->save();

        return redirect()->route('viewBookings')->with('success', 'Booking created successfully.');
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

    public function viewBookings()
    {
        $bookings = Booking::all();
        return view('bookings', ['bookings' => $bookings]);
    }

    public function deleteBooking(Request $request, $id)
    {
        $booking = Booking::find($id);
        $booking->delete();
        return redirect()->route('viewBookings')->with('success', 'Booking deleted successfully.');
    }

}
