import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import { fetchSquad } from './ethereumConnector.js';
import { useEffect, useState } from 'react';

function DisplayUserSquad() {

    const [userSquad, setUserSquad] = useState()

    useEffect(() => {
        try {
            fetchSquad().then(data => {
                console.log(data);
                if(data !== null) {
                    setUserSquad(composeSquad(data));
                }
                else {
                    setUserSquad(<p>You have no squad minted yet!</p>);
                }
            });
        }
        catch (err) {
            setUserSquad(<p>You have no squad minted yet!</p>);
        }

    }, []);

    function composeSquad(bytesSquad) {

        const characters = [<Image src="/img/swordsman.png" fluid />,
        <Image src="/img/lancer.png" fluid />,
        <Image src="/img/knight.png" fluid />];

        const imgSquad = bytesSquad.split("").slice(2, 12).map((e, i) => {
            if (i % 2 !== 0) {
                return characters[e]
            }
            else {
                return ''
            }
        })
        return imgSquad;
    }

    //fetchSquad();


    return (
        <Container>
            {userSquad}
        </Container>
    )
}

export { DisplayUserSquad }