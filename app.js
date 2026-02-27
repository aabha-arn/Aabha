document.getElementById("add-product-btn").onclick = () => {
  const name = product-name.value;
  const price = Number(product-price.value);
  const image = product-image.value;
  const desc = product-description.value;
  const isNew = product-new.checked;

  if(!name || !price || !image || !desc){
    alert("Fill all fields");
    return;
  }

  db.collection("products").add({
    name, price, image, description: desc, isNew,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    alert("Product added");
  });
};