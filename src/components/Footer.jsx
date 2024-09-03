function Footer() {
    return (
      <footer style={styles.footer}>
        <p>&copy; 2024 Product Store. All rights reserved.</p>
      </footer>
    );
  }
  
  const styles = {
    footer: {
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: '#333',
      color: '#fff',
      marginTop: 'auto',
    },
  };
  
  export default Footer;
  