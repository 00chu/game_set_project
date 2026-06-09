import styles from "./commons.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <a href="https://github.com/00chu" target="_blank" rel="noreferrer">
          GitHub : 00chu
        </a>
        <p>© 2026 JiWoo Choi</p>
      </div>
    </footer>
  );
};

export default Footer;
