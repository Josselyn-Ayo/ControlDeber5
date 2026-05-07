//Importar el cliente axios configurando en cliente.ts
//Importamos el tipo de Carros para tipar la respuesta de la API
import { Carro } from '../types/carro';
import { client } from './client';

//Definimos un servicio carroService
//Este servicio va a centralizar las operaciones relacionadas
//con la entidad carro y contendra metodos asincronicos para interactura con la API
export const carroService = {
    //Metodo GET: onbtinene todos los carros del backend
    //Retorna una promesa que resuelve a un arreglo de objetos Carro
    getAll: async (): Promise<Carro[]> => {
        const { data } = await client.get<Carro[]>('/carros');
        return data;
    },
    //Metodo POST: agregar un nuevo carro enviamos la marca al backend
    //Retornar un promisa con el objeto carro recien creado
    add: async (marca:string): Promise<Carro> => {
        const { data } = await client.post<Carro>('/carros', { marca });
        return data;
    }
};