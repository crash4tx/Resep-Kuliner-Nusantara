import { supabase } from "/public/js/supabase.js";

/* ================= ELEMENT ================= */
const provList = document.getElementById("provList");
const recipeList = document.getElementById("recipeList");
const provSelect = document.getElementById("recipe-prov");

const provName = document.getElementById("prov-name");
const provSlug = document.getElementById("prov-slug");
const provImg = document.getElementById("prov-img");
const provBtn = document.getElementById("addProv");

const recTitle = document.getElementById("rec-title");
const recSlug = document.getElementById("rec-slug");
const recDesc = document.getElementById("rec-desc");
const recIng = document.getElementById("rec-ing");
const recStep = document.getElementById("rec-step");
const recImg = document.getElementById("rec-img");
const recBtn = document.getElementById("addRecipe");

/* ================= LOAD PROVINCES (LIST + SELECT) ================= */
async function loadProvinces() {
  provList.innerHTML = "";
  provSelect.innerHTML = "";

  const { data } = await supabase.from("provinces").select("*").order("name");

  data.forEach((p) => {
    // list
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${p.name}</b> (${p.slug})
      <button class="edit-prov" data-id="${p.id}">Edit</button>
      <button class="del-prov" data-id="${p.id}">Hapus</button>
    `;
    provList.appendChild(div);

    // select
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    provSelect.appendChild(opt);
  });
}

/* ================= LOAD RECIPES ================= */
async function loadRecipes() {
  recipeList.innerHTML = "";

  const { data } = await supabase.from("recipes").select("*").order("title");

  data.forEach((r) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${r.title}</b> (${r.slug})
      <button class="edit-rec" data-id="${r.id}">Edit</button>
      <button class="del-rec" data-id="${r.id}">Hapus</button>
    `;
    recipeList.appendChild(div);
  });
}

/* ================= ADD / UPDATE PROVINCE ================= */
provBtn.onclick = async () => {
  const payload = {
    name: provName.value,
    slug: provSlug.value,
  };

  if (provImg.files[0]) {
    const path = `provinces/${provSlug.value}.jpg`;
    await supabase.storage
      .from("images")
      .upload(path, provImg.files[0], { upsert: true });
    payload.image_url = supabase.storage
      .from("images")
      .getPublicUrl(path).data.publicUrl;
  }

  if (provBtn.dataset.edit) {
    await supabase
      .from("provinces")
      .update(payload)
      .eq("id", provBtn.dataset.edit);
    provBtn.innerText = "Simpan Provinsi";
    delete provBtn.dataset.edit;
  } else {
    await supabase.from("provinces").insert(payload);
  }

  provName.value = provSlug.value = "";
  provImg.value = "";
  loadProvinces();
};

/* ================= PROVINCE ACTIONS ================= */
provList.onclick = async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("edit-prov")) {
    const { data } = await supabase
      .from("provinces")
      .select("*")
      .eq("id", id)
      .single();
    provName.value = data.name;
    provSlug.value = data.slug;
    provBtn.innerText = "Update Provinsi";
    provBtn.dataset.edit = id;
  }

  if (e.target.classList.contains("del-prov")) {
    if (!confirm("Hapus provinsi & semua resepnya?")) return;
    await supabase.from("recipes").delete().eq("province_id", id);
    await supabase.from("provinces").delete().eq("id", id);
    loadProvinces();
    loadRecipes();
  }
};

/* ================= ADD / UPDATE RECIPE ================= */
recBtn.onclick = async () => {
  const payload = {
    title: recTitle.value,
    slug: recSlug.value,
    description: recDesc.value,
    ingredients: recIng.value,
    steps: recStep.value,
    province_id: provSelect.value,
  };

  if (recImg.files[0]) {
    const path = `recipes/${recSlug.value}.jpg`;
    await supabase.storage
      .from("images")
      .upload(path, recImg.files[0], { upsert: true });
    payload.image_url = supabase.storage
      .from("images")
      .getPublicUrl(path).data.publicUrl;
  }

  if (recBtn.dataset.edit) {
    await supabase
      .from("recipes")
      .update(payload)
      .eq("id", recBtn.dataset.edit);
    recBtn.innerText = "Simpan Resep";
    delete recBtn.dataset.edit;
  } else {
    await supabase.from("recipes").insert(payload);
  }

  recTitle.value =
    recSlug.value =
    recDesc.value =
    recIng.value =
    recStep.value =
      "";
  recImg.value = "";
  loadRecipes();
};

/* ================= RECIPE ACTIONS ================= */
recipeList.onclick = async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("edit-rec")) {
    const { data } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();
    recTitle.value = data.title;
    recSlug.value = data.slug;
    recDesc.value = data.description;
    recIng.value = data.ingredients;
    recStep.value = data.steps;
    provSelect.value = data.province_id;
    recBtn.innerText = "Update Resep";
    recBtn.dataset.edit = id;
  }

  if (e.target.classList.contains("del-rec")) {
    if (!confirm("Hapus resep ini?")) return;
    await supabase.from("recipes").delete().eq("id", id);
    loadRecipes();
  }
};

/* ================= INIT ================= */
await loadProvinces();
await loadRecipes();
