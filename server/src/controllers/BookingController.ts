import { Controller, Post, Get, Patch, Param, Body, Req } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { Booking } from "../entities/Booking";

@Controller("/bookings")
export class BookingController {
  @Get("/all")
  async getAllBookings() {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const bookings = await bookingRepo.find({
        relations: ["user"],
        order: { created_at: "DESC" },
      });
      return bookings;
    } catch {
      return { error: "Failed to fetch bookings" };
    }
  }

  @Patch("/:id/status")
  async updateBookingStatus(@Param("id") id: number, @Body() body: { status: string }) {
    try {
      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (!validStatuses.includes(body.status)) {
        return { error: "Invalid status" };
      }
      const bookingRepo = AppDataSource.getRepository(Booking);
      const booking = await bookingRepo.findOne({ where: { id } });
      if (!booking) return { error: "Booking not found" };

      booking.status = body.status;
      await bookingRepo.save(booking);
      return booking;
    } catch {
      return { error: "Failed to update booking status" };
    }
  }

  @Post("/create")
  async createBooking(@Body() body: any, @Req() req: any) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const booking = bookingRepo.create({
        user_id: body.user_id,
        office_id: body.office_id,
        office_title: body.office_title,
        office_slug: body.office_slug,
        price: body.price,
        duration: body.duration,
        status: "pending",
      });
      const saved = await bookingRepo.save(booking);
      return saved;
    } catch (error) {
      return { error: "Failed to create booking" };
    }
  }

  @Get("/user/:userId")
  async getUserBookings(@Param("userId") userId: number) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const bookings = await bookingRepo.find({
        where: { user_id: userId },
        order: { created_at: "DESC" },
      });
      return bookings;
    } catch (error) {
      return { error: "Failed to fetch bookings" };
    }
  }

  @Get("/:id")
  async getBooking(@Param("id") id: number) {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const booking = await bookingRepo.findOne({ where: { id } });
      if (!booking) return { error: "Booking not found" };
      return booking;
    } catch (error) {
      return { error: "Failed to fetch booking" };
    }
  }
}