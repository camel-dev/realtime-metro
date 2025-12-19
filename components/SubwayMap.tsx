import React, { useRef, useState, useEffect } from "react";

const lineImages: Record<string, string> = {
  "1": "/realtime-metro/img/line1_v4.png",
  "2": "/realtime-metro/img/line2_v4.png",
  "3": "/realtime-metro/img/line3_v4.png",
  "4": "/realtime-metro/img/line4_v4.png",
  "5": "/realtime-metro/img/line5_v4.png",
  "6": "/realtime-metro/img/line6_v4.png",
  "7": "/realtime-metro/img/line7_v4.png",
  "8": "/realtime-metro/img/line8_v4.png"
};

// 호선별 대표 색상 매핑
const lineColors: Record<string, string> = {
  "1": "#0052A4", // 1호선(남색)
  "2": "#00A84D", // 2호선(초록)
  "3": "#EF7C1C", // 3호선(주황)
  "4": "#00A2D1", // 4호선(하늘)
  "5": "#996CAC", // 5호선(보라)
  "6": "#CD7C2F", // 6호선(갈색)
  "7": "#747F00", // 7호선(연두)
  "8": "#E6186C", // 8호선(분홍)
};

interface SubwayMapProps {
  selectedLine: string;
}

export default function SubwayMap({ selectedLine }: SubwayMapProps) {
  const [scale, setScale] = useState(1);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const [imgSize, setImgSize] = useState({ width: 1, height: 1 });
  const originalSize = { width: 1200, height: 800 }; // 원본 이미지 크기로 수정

  // 이미지 로드 시 실제 렌더링 크기 저장
  const imgRef = useRef<HTMLImageElement>(null);
  // 바깥 div에 ref 추가
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const handle = () => {
      setImgSize({
        width: imgRef.current!.width,
        height: imgRef.current!.height
      });
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [selectedLine]);

  // 터치 드래그 & 핀치줌
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // setDragging(true);
      // dragStart.current = {
      //   x: e.touches[0].clientX,
      //   y: e.touches[0].clientY,
      //   offsetX: drag.x,
      //   offsetY: drag.y
      // };
    } else if (e.touches.length === 2) {
      // setDragging(false);
      // dragStart.current = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = {
        distance: Math.sqrt(dx * dx + dy * dy),
        scale
      };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // setDrag({
      //   x: dragStart.current.offsetX + (e.touches[0].clientX - dragStart.current.x),
      //   y: dragStart.current.offsetY + (e.touches[0].clientY - dragStart.current.y)
      // });
    } else if (e.touches.length === 2 && pinchStart.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const newScale = Math.max(0.5, Math.min(3, pinchStart.current.scale * (newDistance / pinchStart.current.distance)));
      setScale(newScale);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    // setDragging(false);
    // dragStart.current = null;
    pinchStart.current = null;
  };

  // 휠 확대/축소 (PC)
  // const onWheel = (e: React.WheelEvent) => {
  //   if (e.ctrlKey || e.metaKey) return;
  //   e.preventDefault();
  //   setScale(s => Math.max(0.5, Math.min(3, s - e.deltaY * 0.001)));
  // };

  // 실시간 열차 데이터
  const [trains, setTrains] = useState<{
    trainId: string;
    statnNm: string;
    statnTnm: string;
    updnLine: string;
    directAt: string; // 추가!
    trainSttus: string; // 추가
    direction?: string; // 추가: 열차 방향
  }[]>([]);

  useEffect(() => {
    if (!selectedLine) return;
    const fetchTrains = async () => {
      try {
        // 호선명(1,2,3...)을 "1호선", "2호선" 등으로 변환
        const lineName = `${selectedLine}호선`;
        //const url = `http://swopenapi.seoul.go.kr/api/subway/sample/xml/realtimePosition/0/5/${lineName}`;
        //const url = `/1호선.xml`;
        const res = await fetch(`https://metro.jys5540.workers.dev/?line=${lineName}`);
        const xmlText = await res.text();
        // XML 파싱
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const rows = Array.from(xml.getElementsByTagName("row"));
        const data = rows.map(row => ({
          trainId: row.getElementsByTagName("trainNo")[0]?.textContent ?? "",
          statnNm: row.getElementsByTagName("statnNm")[0]?.textContent ?? "",
          statnTnm: row.getElementsByTagName("statnTnm")[0]?.textContent ?? "",
          updnLine: row.getElementsByTagName("updnLine")[0]?.textContent ?? "",
          directAt: row.getElementsByTagName("directAt")[0]?.textContent ?? "",
          trainSttus : row.getElementsByTagName("trainSttus")[0]?.textContent ?? ""
        }));
        // 고유 값 맵 만들기
        const uniqueDataMap = new Map();

        // Map에 항목 추가 및 중복 제거
        data.forEach(item => {
            // 중복 확인을 위한 키 조합
            const key = `${item.trainId}-${item.statnNm}`;
            
            // 중복되지 않는 경우에만 추가
            if (!uniqueDataMap.has(key)) {
                uniqueDataMap.set(key, item);
            }
        });

        // 중복 제거된 데이터 배열 생성
        const uniqueData = Array.from(uniqueDataMap.values());
        console.warn(uniqueData)
        setTrains(uniqueData);
      } catch (e) {
        setTrains([]);
      }
    };
    fetchTrains();
    const interval = setInterval(fetchTrains, 5000);
    return () => clearInterval(interval);
  }, [selectedLine]);
  
  // 1. stationCoords state 선언
  const [stationCoords, setStationCoords] = useState<{ name: string; x: number; y: number; trainSttus: string; updnLine : string; direction?:string}[]>([]);

  // 2. 1호선일 때만 JSON에서 좌표 불러오기
  useEffect(() => {
    if (selectedLine === "1") {
      fetch("/realtime-metro/line1_all_station_coords_updated.json")
        .then(res => res.json())
        .then(setStationCoords);
    } else {
      setStationCoords([]);
    }
  }, [selectedLine]);

  if (!selectedLine || !lineImages[selectedLine]) {
    return (
      <div style={{ textAlign: "center", marginTop: 100, color: "#888" }}>
        노선을 선택하세요.
      </div>
    );
  }

  // 컨테이너에 overflow: hidden, 이미지에 transform 적용
  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "calc(100dvh - 56px)",
        overflow: "auto", // 반드시 auto!
        position: "relative",
        background: "#fafbfc"
      }}
      //onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          position: "relative",
          width: `${originalSize.width * scale}px`,
          height: `${originalSize.height * scale}px`
        }}
      >
        <img
          ref={imgRef}
          src={lineImages[selectedLine]}
          alt={`${selectedLine}호선 노선도`}
          style={{
            width: "100%",
            height: "100%",
            boxShadow: "0 4px 24px #0001",
            borderRadius: 16,
            userSelect: "none",
            display: "block",
            cursor: "default"
          }}
          draggable={false}
          onLoad={() => {
            if (imgRef.current) {
              setImgSize({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight
              });
            }
          }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // 스크롤 위치 보정
            const scrollLeft = containerRef.current?.scrollLeft ?? 0;
            const scrollTop = containerRef.current?.scrollTop ?? 0;

            // 클릭 위치 + 스크롤 위치 = 이미지 내 실제 위치
            const imgX = (clickX + scrollLeft) / scale;
            const imgY = (clickY + scrollTop) / scale;

            console.log(`x: ${Math.round(imgX)-1}, y: ${Math.round(imgY)-1}`);
          }}
        />
        {/* 실시간 열차 데이터에 따른 역-열차 연결선 및 열차 아이콘 표시 */}
        {trains.map(train => {
          const coords = stationCoords.filter(station => {
            if (station.name === "구로") {
              return (
                station.name === train.statnNm
              );
            } else {
              return (
                station.name === train.statnNm &&
                station.trainSttus === train.trainSttus &&
                station.updnLine === train.updnLine
              );
            }
          });

          // check if coords array is empty
          if (coords.length === 0) return null;

          // get the first matched coordinate
          const coord = coords[0];

          const x = coord.x * scale;
          const baseY = coord.y * scale;
          let offsetX = 0;
          let offsetY = 0;

          // 좌우로 벌릴 역 목록
          const horizontalStations = ["시청", "서울", "남영", "용산", "도봉산", "도봉", "방학", "창동", "녹천", "월계", "광운대", "석계", "가산디지털단지", "독산", "관악", "안양", "명학", "금정", "동암", "간석", "주안", "도화"];

          // 상하/좌우 분기
          if (selectedLine !== "2") {
            if (horizontalStations.includes(train.statnNm)) {
              // 좌우로 15px 벌림
              if (train.updnLine === "0") offsetX = -10;
              else if (train.updnLine === "1") offsetX = 13;
            } else {
              // 기존처럼 위아래로 15px 벌림
              if (train.updnLine === "0") offsetY = -5;
              else if (train.updnLine === "1") offsetY =  10;
            }
          }

          const trainX = x + offsetX;
          const trainY = baseY + offsetY;
          const iconX = x + offsetX;
          const iconY = baseY + offsetY;

          const fontColor = lineColors[selectedLine] || "#43a047";

          // 상행/하행/내선/외선 특수문자 및 색상
          let label = "";
          let labelColor = fontColor;
          if (selectedLine === "2") {
            if (train.updnLine === "0") {
              label = "↺";
              labelColor = fontColor;
            } else if (train.updnLine === "1") {
              label = "↻";
              labelColor = fontColor;
            }
          } else {
            if (train.updnLine === "0") {
              label = "▲";
              labelColor = "#EF7C1C";
            } else if (train.updnLine === "1") {
              label = "▼";
              labelColor = "#00A2D1";
            }
          }

          const isExpress = train.directAt === "1" || train.directAt === "7";
          const bgColor = "rgba(255,255,255,0.7)";
          const uniqueKey = `${train.trainId}-${train.statnNm}`;
          
          return (
            <React.Fragment key={uniqueKey}>
              {/* 열차 아이콘 */}
              <div
                style={{
                  position: "absolute",
                  left: iconX - 10, // 기존 -10 → -20 (2배)
                  top: iconY - 7,  // 기존 -7 → -14 (2배)
                  width: 20,        // 기존 20 → 40 (2배)
                  height: 14,       // 기존 14 → 28 (2배)
                  pointerEvents: "none",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title={train.trainId}
              >
                {/* 좌우 대칭 열차 옆모습 아이콘 */}
                <div
                  style={{
                    width: 30,      // 기존 30 → 60 (2배)
                    height: 10,     // 기존 10 → 20 (2배)
                    background: bgColor,
                    borderRadius: "10px 10px 10px 10px / 16px 16px 16px 16px", // 2배
                    border: isExpress ? "1px solid #e53935" : `1px solid ${fontColor}`, // 2배
                    boxShadow: "0 2px 8px #0002", // 2배
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {/* 어디행 + 상/하행 특수문자 */}
                  <span style={{
                    fontSize: 5, // 기존 5 → 10 (2배)
                    color: isExpress ? "#e53935" : fontColor,
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                    textShadow: "0 2px 4px #fff", // 2배
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {train.statnTnm}
                    <span style={{
                      marginLeft: 1, // 기존 1 → 2 (2배)
                      fontSize: 5,  // 기존 5 → 10 (2배)
                      fontWeight: "bold",
                      color: labelColor
                    }}>{label}</span>
                  </span>
                  {/* 바퀴 */}
                  <div style={{
                    position: "absolute",
                    left: 2,         // 기존 2 → 4 (2배)
                    bottom: -3,      // 기존 -3 → -6 (2배)
                    width: 3,        // 기존 3 → 6 (2배)
                    height: 3,       // 기존 3 → 6 (2배)
                    background: "#bbb",
                    borderRadius: "50%"
                  }} />
                  <div style={{
                    position: "absolute",
                    right: 2,        // 기존 2 → 4 (2배)
                    bottom: -3,      // 기존 -3 → -6 (2배)
                    width: 3,        // 기존 3 → 6 (2배)
                    height: 3,       // 기존 3 → 6 (2배)
                    background: "#bbb",
                    borderRadius: "50%"
                  }} />
                </div>
              </div>
            </React.Fragment>
          );
        })}
        {/* 현재 드래그 위치 표시 (디버그용) */}
      </div>
    </div>
  );
}