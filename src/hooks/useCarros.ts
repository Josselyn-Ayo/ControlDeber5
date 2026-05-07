//Importar los hooks de tanstack query
// -useQuery: para consultas GET
//-useMutation: para operarciones POST/PUT/DELETE
//-useQueryClient: para interactuar con la cache
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
//Importar el servicio carroService, que contiene las funciones de API
import { carroService } from '../api/carros.service';
//Definir una constante key me va a servir como identificador unico
//para las querys relacionadas con el recurso carrp
const KEY = ['carros'];

//Hook Personalizado useCarros
//Para encapsular la logica de obtener carros desde la API
//Utilizar useQuery que reemplaza al useEffect y el UseState con queryKey 'carros'
//-queryFin: ejecuta carros Service.getAll() y muestre un consolo log
//-staleTime: definir que los datos se mantengan cacheados por n minutos
export function useCarros() {
    return useQuery({
        queryKey: ['carros'],
        queryFn: () => {
            console.log('Get ejecutado - se fue a la red');
            return carroService.getAll();
        },
        staleTime: 1000 * 60 * 5 // cache valido de 5 minutos
    });
}
//Hook Personalizado
//Emcapsular la logica de agregar un carro nuevo
//Usar useMutation para llamar a carrosService.add()
//onSuccess: invalida la query 'carros' para regresar la lista  automaticamente cuando haya cambios

export function useAgregarCarro() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (marca: string) => carroService.add(marca),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
        
    });
}