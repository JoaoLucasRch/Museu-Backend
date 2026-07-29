import {
  useEffect,
  useState,
} from "react";


import {
  ArtworkService,
} from "@/services/artworks/artworkService";


import type {
  Artwork,
} from "@/types/Artwork";



export default function useArtworks() {


  const [
    obras,
    setObras
  ] = useState<Artwork[]>([]);



  const [
    loading,
    setLoading
  ] = useState(true);



  const [
    error,
    setError
  ] = useState<string | null>(null);



  async function fetchObras() {

    try {

      setLoading(true);

      setError(null);


      const data =
        await ArtworkService
          .getAllForAdmin();


      setObras(data);


    } catch (err) {


      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar obras."
      );


    } finally {

      setLoading(false);

    }

  }



  async function updateStatus(
    id:number,
    status:
      | "aprovada"
      | "rejeitada"
  ) {


    await ArtworkService
      .updateStatus(
        id,
        status
      );


    await fetchObras();

  }



  useEffect(() => {

    fetchObras();

  }, []);



return {
  obras,
  loading,
  error,
  fetchObras,
  updateStatus,
};

}