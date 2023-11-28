export default function salonBooking(db) {
  /* ------------------ FIND FUNCTIONS ------------------ */
  async function findStylist(phoneNumber) {
    return await db.oneOrNone(
      "SELECT * FROM salon_schema.stylist WHERE phone_number=$1",
      [phoneNumber]
    );
  }
  async function findClient(phoneNumber) {
    return await db.oneOrNone(
      "SELECT * FROM salon_schema.client WHERE phone_number=$1",
      [phoneNumber]
    );
  }
  async function findTreatment(code) {
    return await db.oneOrNone(
      "SELECT * FROM salon_schema.treatment WHERE code=$1",
      [code]
    );
  }
  async function findAllTreatments() {
    return await db.any("TABLE salon_schema.treatment");
  }
  /* ------------------ FIND FUNCTIONS ------------------ */

  /* ------------------ FUNCTIONS RELATED TO APPOINTMENTS TABLE ------------------ */
  async function makeBooking(date, time, clientid, treatmentid, stylistid) {
    if (clientid && treatmentid && stylistid && date && time) {
      let treatmentCount = await db.any(
        "SELECT COUNT(treatment_id) FROM salon_schema.booking WHERE booking_date=$1 AND booking_time=$2 AND treatment_id=$3 GROUP BY treatment_id",
        [date, time, treatmentid]
      );
      let stylistCount = await db.any(
        "SELECT COUNT(stylist_id) FROM salon_schema.booking WHERE booking_date=$1 AND booking_time=$2 AND stylist_id=$3 GROUP BY stylist_id",
        [date, time, stylistid]
      );
      //check treatment bookings that exist and only
      //allow treatment bookings and stylist with a count of less than or eqaul to 2
      //for the same date and time, to be added to the table.
      if (treatmentCount.length > 0) {
        if (treatmentCount[0].count <= 2 && stylistCount[0].count <= 2) {
          await db.none(
            "INSERT INTO salon_schema.booking(booking_date,booking_time,client_id,treatment_id,stylist_id) VALUES ($1,$2,$3,$4,$5)",
            [date, time, clientid, treatmentid, stylistid]
          );
        }
      }
      //allow treatment bookings for the first time
      if (treatmentCount.length < 1) {
        await db.none(
          "INSERT INTO salon_schema.booking(booking_date,booking_time,client_id,treatment_id,stylist_id) VALUES ($1,$2,$3,$4,$5)",
          [date, time, clientid, treatmentid, stylistid]
        );
      }
    }
  }
  async function findClientBookings(clientid) {
    return await db.any(
      "SELECT * FROM salon_schema.booking WHERE client_id=$1",
      [clientid]
    );
  }
  async function findStylistsForTreatment(treatmentid) {}
  async function findAllBookings(date, time) {
    return await db.any(
      "SELECT * FROM salon_schema.booking WHERE booking_date=$1 AND booking_time=$2",
      [date, time]
    );
  }
  async function totalIncomeForDay(date) {
    let totalIncome = await db.oneOrNone(
      `SELECT SUM(t.price) AS total, b.booking_date
        FROM salon_schema.booking AS b INNER JOIN
        salon_schema.treatment AS t 
        ON t.id=b.treatment_id 
        WHERE booking_date=$1
        GROUP BY b.booking_date
      `,
      [date]
    );
    return totalIncome.total;
  }
  async function mostValuableClient() {
    let valuableClient = await db.oneOrNone(
      `SELECT first_name FROM (SELECT SUM(t.price) AS spent, c.first_name
        FROM salon_schema.booking AS b
        INNER JOIN salon_schema.treatment AS t
        ON t.id=b.treatment_id
        INNER JOIN salon_schema.client AS c
        ON c.id=b.client_id
        GROUP BY c.first_name) AS total
        ORDER BY spent DESC LIMIT 1
      `
    );
    return valuableClient.first_name;
  }
  async function totalCommission(date, stylistid) {}
  return {
    findStylist,
    findClient,
    findTreatment,
    findAllTreatments,
    findAllBookings,
    findClientBookings,
    findStylistsForTreatment,
    makeBooking,
    totalIncomeForDay,
    mostValuableClient,
    totalCommission,
  };
}
