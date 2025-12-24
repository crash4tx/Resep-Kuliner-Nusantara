import { supabase } from "/public/js/supabase.js";

/*
  ASUMSI HTML LAMA LU SUDAH PUNYA:
  - 1 row contoh (dummy) untuk makanan
  - 1 row contoh (dummy) untuk provinsi
  - masing-masing punya class konsisten
*/

// =========================
// PERINGKAT MAKANAN
// =========================
const makananList = document.querySelector("#peringkat-makanan-list");
const makananTemplate = document.querySelector(".peringkat-makanan-row");

makananTemplate.style.display = "none";

const { data: recipes, error: recipeErr } = await supabase.from("recipes")
  .select(`
    title,
    image_url,
    likes,
    dislikes,
    provinces ( name )
  `);

if (recipeErr) {
  console.error(recipeErr);
}

const rankedMakanan = recipes
  .map((r) => ({
    ...r,
    score: (r.likes || 0) - (r.dislikes || 0),
  }))
  .sort((a, b) => b.score - a.score);

rankedMakanan.forEach((item, index) => {
  const row = makananTemplate.cloneNode(true);
  row.style.display = "";
  row.removeAttribute("id");

  // ranking icon
  row.querySelector(".rank-icon").innerText =
    index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

  row.querySelector(".rank-provinsi").innerText = item.provinces.name;

  row.querySelector(".rank-makanan img").src = item.image_url;

  row.querySelector(".rank-makanan span").innerText = item.title;

  row.querySelector(".rank-skor").innerText = item.score;

  makananList.appendChild(row);
});

// =========================
// PERINGKAT PROVINSI
// =========================
const provList = document.querySelector("#peringkat-provinsi-list");
const provTemplate = document.querySelector(".peringkat-provinsi-row");

provTemplate.style.display = "none";

const { data: provinces } = await supabase.from("provinces").select(`
    name,
    recipes ( likes )
  `);

const rankedProv = provinces
  .map((p) => ({
    name: p.name,
    totalLikes: p.recipes.reduce((sum, r) => sum + (r.likes || 0), 0),
  }))
  .sort((a, b) => b.totalLikes - a.totalLikes);

rankedProv.forEach((prov, index) => {
  const row = provTemplate.cloneNode(true);
  row.style.display = "";

  row.querySelector(".rank-icon").innerText =
    index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

  row.querySelector(".rank-provinsi").innerText = prov.name;

  row.querySelector(".rank-total-like").innerText =
    prov.totalLikes.toLocaleString("id-ID");

  provList.appendChild(row);
});
