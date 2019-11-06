import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { withTranslation } from '../i18n'

const Dog = ({ src, t }) => {
  const router = useRouter()
  const { bid } = router.query
  return (
    <div>
      <Head>
        <title>{ `${t('dogs:dogs')} | ${bid}` }</title>
      </Head>
      <nav>
        <Link href='/'>
          <a>
            { t('common:back') }
          </a>
        </Link>
      </nav>
      <img src={src} />
    </div>
  )
}

Dog.getInitialProps = async ({ query }) => {
  const { bid } = query
  const response = await fetch(`https://dog.ceo/api/breed/${bid}/images/random`)
  const { message: src } = await response.json()
  return {
    src,
    namespacesRequired: ['common']
  }
}

export default withTranslation(['common', 'dogs'])(Dog)
