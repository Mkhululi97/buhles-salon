import assert from "assert";
import SalonBooking from "../salon-booking.js";
import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();
// TODO configure this to work.
const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://localhost:5432/salon_test";

const config = {
  connectionString: DATABASE_URL,
};

const pgp = pgPromise();
const db = pgp(config);

let booking = SalonBooking(db);

describe("The Booking Salon", function () {
  //   beforeEach(async function () {
  //     await db.none(`delete from booking`);
  //   });
  it("should be able to list treatments", async function () {
    const treatments = await booking.findAllTreatments();
    assert.equal(4, treatments.length);
  });

  it("should be able to find a stylist", async function () {
    const stylist = await booking.findStylist("089 889 7878");
    const result = {
      id: 1,
      first_name: "Karabo",
      last_name: "Jobe",
      phone_number: "089 889 7878",
      commission_percentage: 0.15,
    };

    assert.deepEqual(result, stylist);
  });
  it("should be able to find a client", async function () {
    const client = await booking.findClient("078 452 0447");
    const result = {
      id: 1,
      first_name: "Sara",
      last_name: "Futho",
      phone_number: "078 452 0447",
    };

    assert.deepEqual(result, client);
  });
  //  ""
  it("should be able to find treatment by treatment code", async function () {
    const treatment = await booking.findTreatment("pedi");
    const result = {
      id: 1,
      type: "Pedicure",
      code: "pedi",
      price: 175.0,
    };

    assert.deepEqual(result, treatment);
  });
  it("should be able to allow a client to make a booking", async function () {
    const client = await booking.findClient("***");

    const booking = await booking.makeBooking(
      treatmentId,
      client.id,
      date,
      time
    );

    const bookings = await booking.findClientBookings(client.id);
    assert.equal([], bookings);
  });

  it("should be able to get client booking(s)", async function () {
    const client1 = await booking.findClient("***");
    const client2 = await booking.findClient("***");

    const treatment1 = await booking.findTreatment("***");
    const treatment2 = await booking.findTreatment("***");

    await booking.booking(treatment1.id, client1.id, date, time);
    await booking.booking(treatment2.id, client1.id, date, time);
    await booking.booking(treatment1.id, client2.id, date, time);

    const bookings = await booking.findAllBookings(client);

    assert.equal([], clientBooking);
  });

  it("should be able to get bookings for a date", async function () {
    const client1 = await booking.findClient("***");
    const client2 = await booking.findClient("***");

    const treatment1 = await booking.findTreatment("***");
    const treatment2 = await booking.findTreatment("***");

    await booking.booking(treatment1.id, client1.id, date, time);
    await booking.booking(treatment2.id, client1.id, date, time);
    await booking.booking(treatment3.id, client2.id, date, time);

    const bookings = await booking.findAllBookings({ date, time });

    assert.equal([], bookings);
  });

  it("should be able to find the total income for a day", function () {
    assert.equal(1, 2);
  });

  it("should be able to find the most valuable client", function () {
    assert.equal(1, 2);
  });
  it("should be able to find the total commission for a given stylist", function () {
    assert.equal(1, 2);
  });

  after(function () {
    db.$pool.end();
  });
});
