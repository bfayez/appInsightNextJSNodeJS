import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (

  <h1 className={styles.title}>
    Read <Link href="/posts/first-post">this page!</Link>
  </h1>

      

  );
}
