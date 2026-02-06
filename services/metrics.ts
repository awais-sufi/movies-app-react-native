import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION_NAME = process.env.EXPO_PUBLIC_FIRESTORE_METRICS_COLLECTION!;

export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
  try {
    const docId = `${searchTerm}_${movie.id}`;
    const ref = doc(db, COLLECTION_NAME, docId);

    // Check if document already exists
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await updateDoc(ref, {
        count: increment(1),
      });
    } else {
      await setDoc(ref, {
        searchTerm,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      });
    }
  } catch (error: any) {
    console.error(
      "Failed to write Firestore document:",
      error.code,
      error.message,
    );
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  const q = query(
    collection(db, "metrics"),
    orderBy("count", "desc"),
    limit(5),
  );
  const snapshot = await getDocs(q);

  const movies: TrendingMovie[] = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (
      typeof data.searchTerm === "string" &&
      typeof data.movie_id === "number" &&
      typeof data.title === "string" &&
      typeof data.count === "number" &&
      typeof data.poster_url === "string"
    ) {
      movies.push(data as TrendingMovie);
    } else {
      console.warn("Skipping invalid doc", data);
    }
  });

  return movies;
};
