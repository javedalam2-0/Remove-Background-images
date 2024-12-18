document.addEventListener("DOMContentLoaded", () => {
  const uploadArea = document.getElementById("upload-area");
  const imageInput = document.getElementById("imageInput");
  const removebtn = document.getElementById("removeBackgroundBtn");
  const resetbtn = document.getElementById("resetBtn");
  const result = document.getElementById("result");

  let selectedFile = null;
  //upload the file from user
  uploadArea.addEventListener("click", () => {
    imageInput.click();
  });

  //Drag and drop

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation()
    handleFile(e.dataTransfer.files[0]);
  });

  imageInput.addEventListener("change", (e) => {
    handleFile(e.target.files[0]);
  });

  function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
      selectedFile = file;
      const reader = new FileReader(file);
      reader.onload = () => {
        displayImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file");
    }
  }
  function displayImage(imgsrc) {
    result.innerHTML = `<img src=${imgsrc} />`
  }
  removebtn.addEventListener("click", () => {
    if (selectedFile) {
      removeBackground(selectedFile);
    } else {
      alert("Please select an image file");
    }
  });
  async function removeBackground(file) {
    const apikey = "Kn8bnsDpQ8mh11drtzmtnRFe";
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");
    result.innerHTML = "<p>Removing Background...</p>";
    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-API-KEY": apikey,
        },
        body: formData,
      });

      if(!response.ok) throw new Error("failed to Remove background");
        const blob = await response.blob();
        const imageURL = URL.createObjectURL(blob);
        result.innerHTML = `<img src=${imageURL} />`

        const downloadBtn = document.createElement("button")
        downloadBtn.innerText = "Download Image"
        downloadBtn.classList.add("btn")
        downloadBtn.addEventListener("click",()=>{
             const link = document.createElement("a")
             link.href = imageURL
             link.download = "background_remove.png"
             link.click();
            })
            result.appendChild(downloadBtn);
         
    } catch (error) {
      console.log(error);
    }
    
  }
  resetbtn.addEventListener("click",()=>{
    selectedFile = null;
    result.innerHTML =" <p>No Image Processed yet...</p>";
    imageInput.value =  ''
  })
});
