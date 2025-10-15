import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <h4 style={styles.heading}>Customer Service</h4>
          <a style={styles.link}>Help</a>
          <a style={styles.link}>Track Order</a>
          <a style={styles.link}>Size Chart</a>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Worry Free Shopping</h4>
          <a style={styles.link}>Promo Terms and Exclusions</a>
          <a style={styles.link}>Coupons & Promotions</a>
          <a style={styles.link}>Transfer Shield</a>
          <a style={styles.link}>Safe Shopping</a>
          <a style={styles.link}>Delivery & Shipping</a>
          <a style={styles.link}>365-Day Returns</a>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Information</h4>
          <a style={styles.link}>My Account</a>
          <a style={styles.link}>About Us</a>
          <a style={styles.link}>Affiliate Program</a>
          <a style={styles.link}>Student & Key Worker Discount</a>
        </div>

        <div style={{...styles.column, ...styles.rightColumn}}>
          <div style={{textAlign:'right'}}>
            <p style={{margin:0}}>Stay updated on sales, new items and more</p>
            <button style={styles.signup}>SIGN UP & SAVE 15%</button>
            <div style={{marginTop:12, textAlign:'right'}}>
              <div style={{fontWeight:700, marginBottom:6}}>Follow Us</div>
              <div style={styles.socials}>
                <div style={styles.social}>f</div>
                <div style={styles.social}>X</div>
                <div style={styles.social}>□</div>
                <div style={styles.social}>▶</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#f5f5f5',
    padding: '28px 0',
    marginTop: 24,
  },
  container: {
    display: 'flex',
    gap: 24,
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 16px',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    minWidth: 160,
  },
  rightColumn: {
    maxWidth: 320,
    flex: '0 0 320px',
  },
  heading: {
    margin: 0,
    marginBottom: 10,
    fontSize: 16,
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    fontSize: 14,
    cursor: 'pointer',
  },
  signup: {
    background: '#c94b3b',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 8,
  },
  socials: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  social: {
    width: 32,
    height: 32,
    borderRadius: 16,
    background: '#111',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
  },
};

export default Footer;
