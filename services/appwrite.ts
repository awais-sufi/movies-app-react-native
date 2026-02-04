import { Client, Databases, ID, Query } from "react-native-appwrite";

// 🔹 Environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_NAME = "metrics"; // Table name in Appwrite relational DB

// 🔹 Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

// 🔹 Table document type
interface MovieDoc {
  id: string | number; // PK column in relational table
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url?: string;
}

// 🔹 Trending movie type
export type TrendingMovie = MovieDoc;

// 🔹 Update or create search count
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // 1️⃣ Check if the movie + searchTerm already exists
    const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [
      Query.equal("searchTerm", query),
      Query.equal("movie_id", movie.id),
      Query.limit(1),
    ]);

    if (result.documents.length > 0) {
      // 2️⃣ Increment count
      const existingMovie = result.documents[0] as unknown as MovieDoc;

      console.log("Existing movie found:", existingMovie);

      await database.updateDocument(
        DATABASE_ID,
        TABLE_NAME,
        existingMovie.id.toString(),
        {
          count: existingMovie.count + 1,
        },
      );

      console.log(`Updated count to ${existingMovie.count + 1}`);
    } else {
      // 3️⃣ Create new row
      const newDoc = await database.createDocument(
        DATABASE_ID,
        TABLE_NAME,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : undefined,
        },
      );

      console.log("Created new movie row:", newDoc);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// 🔹 Get top trending movies
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    console.log("Trending movies:", result.documents);

    return result.documents as unknown as MovieDoc[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return undefined;
  }
};
