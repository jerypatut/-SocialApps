import  multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


// Definisikan __dirname manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Menentukan lokasi penyimpanan dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Menggunakan path absolute ke folder 'assets' di root
    cb(null, path.join(__dirname, '../assets')); // Menyimpan file di folder 'assets' yang ada di luar folder routes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik berdasarkan timestamp
  },
});

// Menyiapkan multer untuk menerima file dengan size limit dan jenis file tertentu
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal ukuran file 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true); // File diterima
    }
    cb(new Error('Only image files are allowed!'), false); // Jika bukan gambar, reject file
  },
});

export default upload;