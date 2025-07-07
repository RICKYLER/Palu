import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

interface EncryptionResult {
  encryptedData: string;
  iv: string;
}

class EncryptionService {
  private static readonly ENCRYPTION_KEY = "paluchain_encryption_key";
  private static readonly IV_LENGTH = 16;

  // Generate or retrieve encryption key
  private static async getEncryptionKey(): Promise<string> {
    try {
      let key = await SecureStore.getItemAsync(this.ENCRYPTION_KEY);
      if (!key) {
        // Generate a new 256-bit key
        const keyBytes = await Crypto.getRandomBytesAsync(32);
        key = Array.from(keyBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        await SecureStore.setItemAsync(this.ENCRYPTION_KEY, key);
      }
      return key;
    } catch (error) {
      console.error("Error getting encryption key:", error);
      throw new Error("Failed to get encryption key");
    }
  }

  // Simple XOR encryption for demonstration (in production, use proper AES)
  static async encryptData(data: string): Promise<EncryptionResult> {
    try {
      const key = await this.getEncryptionKey();
      const iv = await Crypto.getRandomBytesAsync(this.IV_LENGTH);
      const ivString = Array.from(iv)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Simple XOR encryption (for demo purposes)
      const encrypted = data
        .split("")
        .map((char, index) => {
          const keyChar = key.charCodeAt(index % key.length);
          const ivChar = iv[index % iv.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar ^ ivChar);
        })
        .join("");

      const encryptedBase64 = btoa(encrypted);

      return {
        encryptedData: encryptedBase64,
        iv: ivString,
      };
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  static async decryptData(
    encryptedData: string,
    ivString: string,
  ): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      const iv = new Uint8Array(
        ivString.match(/.{2}/g)?.map((byte) => parseInt(byte, 16)) || [],
      );

      const encrypted = atob(encryptedData);

      // Simple XOR decryption
      const decrypted = encrypted
        .split("")
        .map((char, index) => {
          const keyChar = key.charCodeAt(index % key.length);
          const ivChar = iv[index % iv.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar ^ ivChar);
        })
        .join("");

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  // Encrypt and store data securely
  static async secureStore(key: string, data: string): Promise<void> {
    try {
      const encrypted = await this.encryptData(data);
      const payload = JSON.stringify(encrypted);
      await SecureStore.setItemAsync(key, payload);
    } catch (error) {
      console.error("Secure store error:", error);
      throw new Error("Failed to store data securely");
    }
  }

  // Retrieve and decrypt data
  static async secureRetrieve(key: string): Promise<string | null> {
    try {
      const payload = await SecureStore.getItemAsync(key);
      if (!payload) return null;

      const encrypted: EncryptionResult = JSON.parse(payload);
      return await this.decryptData(encrypted.encryptedData, encrypted.iv);
    } catch (error) {
      console.error("Secure retrieve error:", error);
      return null;
    }
  }

  // Clear encryption key (for logout/reset)
  static async clearEncryptionKey(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.ENCRYPTION_KEY);
    } catch (error) {
      console.error("Error clearing encryption key:", error);
    }
  }
}

export default EncryptionService;
