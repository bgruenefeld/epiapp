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
                marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"< 0.3"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px", backgroundColor: "#e53935",
                marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"> 0.3 bis ≤ 0.7"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px", backgroundColor: "#7e57c2",
                marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"> 0.7"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px",
                borderRadius: "50%", marginRight: "6px"
              }}></div>
              <span style={{ color: "white", fontSize: "14px" }}>{"Hund mit direkten Epi Nachkommen:"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "14px", height: "14px", backgroundColor: "#ff9800",
                marginRight: "6px"
              }}></div>              
            </div>
          </div>
    );
};
export default EpiScoreBox;
