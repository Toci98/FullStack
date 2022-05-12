import React, { useState, FC } from "react";
import { gql, useMutation } from "@apollo/client"

const ADD_PERSON = gql`
    mutation addPerson($name: String, $surname: String, $phone_number: String, $email: String) {
        addPerson(name: $name, surname: $surname, phone_number: $phone_number, email: $email) {
            _id
        }
    }
`

const AddPerson: FC<{
    reloadHandler: () => void
}> = ({ reloadHandler }) => {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [phone_number, setPhone_number] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [addPersonMutation] = useMutation(ADD_PERSON);

    return <div>
        <h1>Añadir un nuevo contacto</h1>
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
        <button onClick={() => addPersonMutation({
            variables: {
                name,
                surname,
                phone_number,
                email
            },
        }).then(() => {
            reloadHandler();
            setName("");
            setSurname("")
            setPhone_number("")
            setEmail("")
        })
        }
        >
            Añadir
        </button>
    </div>
}
export default AddPerson;