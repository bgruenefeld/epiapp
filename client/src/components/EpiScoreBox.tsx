const EpiScoreBox = ( ) => {
    
    return (
        <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            fontFamily: "Arial, sans-serif",
            margin: "20px 0",
            padding: "8px",
            borderRadius: "8px",
            maxWidth: "450px" // Begrenzt die Breite für eine kompakte Anzeige
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px",
                borderRadius: "50%", marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"Episcore Legende:"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px", backgroundColor: "#ff9800",
                borderRadius: "50%", marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"< 0.3"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px", backgroundColor: "#e53935",
                borderRadius: "50%", marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"> 0.3 bis ≤ 0.7"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px", backgroundColor: "#7e57c2",
                borderRadius: "50%", marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"> 0.7"}</span>
            </div>
          </div>
    );
};
export default EpiScoreBox;
