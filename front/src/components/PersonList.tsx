import React, { FC, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client"

type Person = {
    _id: string;
    name: string;
    surname: string;
    phone_number: string;
    email: string
}

const GET_PERSONS = gql`
query getPersons ($sort : Boolean){
    getPersons (sort: $sort){
        _id
        name
        surname
        phone_number
        email
    }
}
`;

const DELETE_PERSON = gql`
    mutation delete($phone_number: String) {
        delete(phone_number: $phone_number) {
            phone_number
        }
    }
`;

const UPDATE_PERSON = gql`
    mutation update($phone_number_init: String, $name: String, $surname: String, $phone_number: String, $email: String) {
        update(phone_number_init:$phone_number_init, name: $name, surname: $surname, phone_number: $phone_number, email: $email) {
            phone_number
        }
    }
`;

const GET_SORTED_PERSONS = gql`
    mutation getSortedPersons($sort: Boolean) {
        getSortedPersons(sort: $sort) {
            _id
            name
            surname
            phone_number
            email
        }
    }
`;

const PersonsList: FC<{
    reloadHandler: () => void
}> = ({ reloadHandler }) => {
    const [sort, setSort] = useState<boolean>();
    const { data, loading, error } = useQuery<{ getPersons: Person[] }>(GET_PERSONS, {
        fetchPolicy: "network-only",
        variables: {sort}
    });
    
    const [deletePersonMutation] = useMutation(DELETE_PERSON);
    const [updatePersonMutation] = useMutation(UPDATE_PERSON);
    const [getSortedPersons] = useMutation(GET_SORTED_PERSONS);
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [phone_number, setPhone_number] = useState<string>("");
    const [phone_number_init, setPhone_number_init] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    function deleteAux(parameter: string) {
        const phone_number = parameter;
        console.log(phone_number);
        deletePersonMutation({
            variables: {
                phone_number
            }
        });
        reloadHandler();
    }

    function updateAux(name: string, surname: string, phone_number: string, email: string) {
        console.log(name);
        setName(name);
        setSurname(surname);
        setPhone_number(phone_number);
        setEmail(email);
        setPhone_number_init(phone_number);
    }

    function confirmUpdate() {
        console.log(phone_number_init);
        updatePersonMutation({
            variables: {
                phone_number_init,
                name,
                surname,
                phone_number,
                email
            }
        }).then(() => {
            reloadHandler();
            setPhone_number_init("");
            setName("");
            setSurname("");
            setPhone_number("");
            setEmail("");
        });
    }

    if (loading) return <div>Cargando...</div>
    if (error) return <div>Error</div>
    return <div>
        <h1>Modificar un contacto</h1>
        <input type="text"
            value={name}
            placeholder="Nombre"
            onChange={(e) => setName(e.target.value)} />
        <input type="text"
            value={surname}
            placeholder="Apellidos"
            onChange={(e) => setSurname(e.target.value)} />
        <input type="text"
            value={phone_number}
            placeholder="Numero de teléfono"
            onChange={(e) => setPhone_number(e.target.value)} />
        <input type="text"
            value={email}
            placeholder="Correo electrónico"
            onChange={(e) => setEmail(e.target.value)} />
        <button onClick={() => confirmUpdate()}>Confirmar</button>

        <h1>Listado completo de contactos</h1>
        <button onClick={() => setSort(true)}>A-Z</button>
        <button onClick={() => setSort(false)}>Z-A</button>
        {data?.getPersons.map(person => (
            <div id="test" key={person._id}>
                <h2>{person.name + ""} {person.surname}</h2>
                <h5>Número de teléfono {": " + person.phone_number}</h5>
                <h5>Correo electrónico {": " + person.email}</h5>
                <button onClick={
                    () => deleteAux(person.phone_number)
                }> Eliminar este contacto</button>
                <button onClick={() => updateAux(person.name, person.surname, person.phone_number, person.email)}> Modificar este contacto</button>
            </div>
        ))}
    </div>
}
export default PersonsList;