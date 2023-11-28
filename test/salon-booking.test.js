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
  this.timeout(10000);
  beforeEach(async function () {
    await db.none(
      `TRUNCATE TABLE salon_schema.booking RESTART IDENTITY CASCADE`
    );
  });
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
    //await booking.makeBooking(date(mm/dd/yyyy), time, clientid, treatmentid, stylistid);
    await booking.makeBooking("02/17/2023", "09:00:45", 1, 2, 1);
    await booking.makeBooking("02/18/2023", "10:00:45", 3, 2, 3);
    let bookings = await booking.findClientBookings(1);
    assert.deepEqual(
      [
        {
          booking_date: new Date("2023-02-17T22:00:00.000Z"),
          booking_time: "09:00:45",
          client_id: 1,
          id: 1,
          stylist_id: 1,
          treatment_id: 2,
        },
      ],
      bookings
    );
    bookings = await booking.findClientBookings(3);
    assert.deepEqual(
      [
        {
          booking_date: new Date("2023-02-17T22:00:00.000Z"),
          booking_time: "10:00:45",
          client_id: 3,
          id: 2,
          stylist_id: 3,
          treatment_id: 2,
        },
      ],
      bookings
    );
  });

  it("should be able to get client booking(s)", async function () {
    const client1 = await booking.findClient("078 452 0447");
    const client2 = await booking.findClient("084 313 0137");

    const treatment1 = await booking.findTreatment("pedi");
    const treatment2 = await booking.findTreatment("make");

    const stylist1 = await booking.findStylist("089 889 7878");
    const stylist2 = await booking.findStylist("078 812 7878");
    //await booking.makeBooking(date(mm/dd/yyyy), time, clientid, treatmentid, stylistid);
    await booking.makeBooking(
      "12/15/2023",
      "09:05:57",
      client1.id,
      treatment1.id,
      stylist1.id
    );
    await booking.makeBooking(
      "12/25/2023",
      "08:00:17",
      client1.id,
      treatment2.id,
      stylist2.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client2.id,
      treatment1.id,
      stylist2.id
    );

    const client1Booking = await booking.findClientBookings(client1.id);
    assert.equal(2, client1Booking.length);
    const client2Booking = await booking.findClientBookings(client2.id);
    assert.equal(1, client2Booking.length);
  });

  it("should be able to get bookings for a date", async function () {
    const client1 = await booking.findClient("081 152 2337");
    const client2 = await booking.findClient("087 481 4787");

    const stylist2 = await booking.findStylist("071 589 2348");
    const stylist3 = await booking.findStylist("078 812 7878");

    const treatment1 = await booking.findTreatment("brolash");
    const treatment2 = await booking.findTreatment("make");
    //   //await booking.makeBooking(date(mm/dd/yyyy), time, clientid, treatmentid, stylistid);

    await booking.makeBooking(
      "12/15/2023",
      "09:05:57",
      client1.id,
      treatment1.id,
      stylist3.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client1.id,
      treatment2.id,
      stylist2.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client2.id,
      treatment1.id,
      stylist2.id
    );
    let date = "12/31/2023";
    let time = "10:45:07";
    const bookings = await booking.findAllBookings(date, time);

    assert.equal(2, bookings.length);
  });

  it("should be able to find the total income for a day", async function () {
    const client1 = await booking.findClient("081 152 2337");
    const client2 = await booking.findClient("087 481 4787");

    const stylist2 = await booking.findStylist("071 589 2348");
    const stylist3 = await booking.findStylist("078 812 7878");

    const treatment1 = await booking.findTreatment("brolash");
    const treatment2 = await booking.findTreatment("make");
    //   //await booking.makeBooking(date(mm/dd/yyyy), time, clientid, treatmentid, stylistid);

    await booking.makeBooking(
      "12/15/2023",
      "09:05:57",
      client1.id,
      treatment1.id,
      stylist3.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client1.id,
      treatment2.id,
      stylist2.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client2.id,
      treatment1.id,
      stylist2.id
    );
    let result = await booking.totalIncomeForDay("12/31/2023");
    assert.equal(425.0, result);
  });

  it("should be able to find the most valuable client", async function () {
    const client1 = await booking.findClient("081 152 2337");
    const client2 = await booking.findClient("087 481 4787");

    const stylist2 = await booking.findStylist("071 589 2348");
    const stylist3 = await booking.findStylist("078 812 7878");

    const treatment1 = await booking.findTreatment("brolash");
    const treatment2 = await booking.findTreatment("mani");
    //await booking.makeBooking(date(mm/dd/yyyy), time, clientid, treatmentid, stylistid);

    await booking.makeBooking(
      "12/15/2023",
      "09:05:57",
      client2.id,
      treatment1.id,
      stylist3.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client1.id,
      treatment2.id,
      stylist2.id
    );
    await booking.makeBooking(
      "12/31/2023",
      "10:45:07",
      client2.id,
      treatment2.id,
      stylist2.id
    );
    let result = await booking.mostValuableClient();
    assert.equal("Nthabiseng", result);
  });
  // it("should be able to find the total commission for a given stylist", function () {
  //   assert.equal(1, 2);
  // });

  after(function () {
    db.$pool.end();
  });
});
