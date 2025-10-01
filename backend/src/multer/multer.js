import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Untuk mendukung __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debug log untuk cek nilai path
console.log('import.meta.url:', import.meta.url);
console.log('__filename:', __filename);
console.log('__dirname:', __dirname);

// Menentukan lokasi penyimpanan dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../assets');
    console.log('Destination folder:', dest);
    cb(null, dest); // Simpan file ke folder assets
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('Saving file as:', filename);
    cb(null, filename);
  },
});

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'), false);
  },
});

export default upload;
