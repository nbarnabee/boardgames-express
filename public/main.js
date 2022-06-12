let deleteButtons = Array.from(document.getElementsByClassName("delete"));
deleteButtons.forEach((button) =>
  button.addEventListener("click", deleteRapper)
);

let likeButtons = Array.from(document.getElementsByClassName("like"));
likeButtons.forEach((button) => button.addEventListener("click", addLike));

async function addLike() {
  const sName = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("addLike", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        "stageNameS": sName 
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

async function deleteRapper() {
  const sName = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteRapper", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "stageNameS": sName,
      })
    })
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
