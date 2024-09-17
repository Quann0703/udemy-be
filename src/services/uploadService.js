const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../config/firebase.config");

async function uploadImage(file, quantity) {
  const storageFB = getStorage();

  await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_USER,
    process.env.FIREBASE_AUTH
  );

  if (quantity === "single") {
    const dateTime = Date.now();
    const fileName = `images/${dateTime}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      contentType: file.type,
    };
    await uploadBytesResumable(storageRef, file.buffer, metadata);

    // Lấy đường dẫn của ảnh đã tải lên
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  }

  if (quantity === "multiple") {
    const imageUrls = [];

    for (let i = 0; i < file.images.length; i++) {
      const dateTime = Date.now();
      const fileName = `images/${dateTime}`;
      const storageRef = ref(storageFB, fileName);
      const metadata = {
        contentType: file.images[i].mimetype,
      };

      const saveImage = await Image.create({ imageUrl: fileName });
      file.item.imageId.push({ _id: saveImage._id });
      await file.item.save();

      await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

      // Lấy đường dẫn của ảnh đã tải lên
      const downloadURL = await getDownloadURL(storageRef);
      imageUrls.push(downloadURL);
    }

    return imageUrls;
  }
}

module.exports = { uploadImage };
