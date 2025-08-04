const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
   const API_KEY = process.env.GOOGLE_API_KEY;
   const PLACE_ID = process.env.PLACE_ID;

   if (!API_KEY || !PLACE_ID) {
      return res.status(500).json({ error: "Faltan claves de API o Place ID" });
   }

   const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=review,rating,user_ratings_total&key=${API_KEY}`;

   try {
      const response = await fetch(url);
      const data = await response.json();
      const reviews = data.result?.reviews || [];
      res.status(200).json(reviews);
   } catch (error) {
      res.status(500).json({
         error: "Error al obtener reseñas",
         detail: error.message,
      });
   }
};
