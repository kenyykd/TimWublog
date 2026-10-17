import { getFirestore } from 'firebase/firestore'
import app from '@/config/firebase'

// 只有留言板會 import 這個檔案，Firestore SDK 會跟著留言板頁一起懶載入
export const db = getFirestore(app)
