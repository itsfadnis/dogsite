import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { withTranslation } from '../i18n'

const Home = ({ breeds, t }) => (
  <div>
    <Head>
      <title>{ t('common:dogs') }</title>
    </Head>
    <h1>{ t('dogs:dogs') }</h1>
    <ul>
      {
        breeds.map(breed =>
          <li key={breed}>
            <Link
              href='/[bid]'
              as={`/${breed}`}
            >
              <a>
                { breed }
              </a>
            </Link>
          </li>
        )
      }
    </ul>
  </div>
)

Home.getInitialProps = async () => {
  const response = await fetch('https://dog.ceo/api/breeds/list')
  const { message: breeds } = await response.json()
  return {
    breeds,
    namespacesRequired: ['dogs']
  }
};

export default withTranslation('dogs')(Home)
