import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import { Title, Form, Repositories, Error } from './styles';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
    full_name: string;
    owner: {
        login: string;
        avatar_url: string;
    },
    description: string;
}

const Dashboard: React.FC = () => {

    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');

    const [repositories, setRepositories] = useState<Repository[]>(()=> {
        const storageRepos = localStorage.getItem('@GithubExplorer:repositories')
        if (storageRepos){
            return JSON.parse(storageRepos)
        }
        return [];
    });

    useEffect (() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault()

        if (!newRepo){
            return setInputError('Digite o autor/nome do repositório');
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data
            setRepositories([ ...repositories, repository])
            setNewRepo('');
            setInputError('');
        } catch (error) {
            setInputError('Erro na busca por esse repositório');
        }
    }

    return (
        <>
            <img src={logoImg} alt='Github'/>
            <Title> Explore repositórios no Github </Title>

            <Form hasError={!! inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value) }
                    type='text'
                    placeholder='Digite o nome do repositório'/>
                <button type='submit'>Pesquisar</button>
            </Form>

            {inputError && <Error> {inputError} </Error>}

            <Repositories>

                {repositories.map(repository => (
                    <Link to={`/repository/${repository.full_name}`} key={repository.full_name}>
                        <img src={repository.owner.avatar_url}
                            alt={repository.owner.login} />

                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}

            </Repositories>
        </>
    );
}

export default Dashboard;
