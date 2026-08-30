import { Transmit } from "@adonisjs/transmit-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

let transmitInstance: Transmit | null = null;

export function getTransmitClient(): Transmit {
  if (typeof window === "undefined") {
    return new Transmit({ baseUrl: API_BASE_URL });
  }

  if (!transmitInstance) {
    transmitInstance = new Transmit({
      baseUrl: API_BASE_URL,
    });
  }

  return transmitInstance;
}
