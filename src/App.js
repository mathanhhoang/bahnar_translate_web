import { useState, useEffect, useCallback, useRef } from "react";
import { Container, Col, Row } from "reactstrap";
import "./App.css";
import _ from "lodash";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import config from './components/config';
require('dotenv').config()
console.log(config)
const API = process.env.API

function App() {
  
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  // axios.post('https://bahnar.gdtsolutions.vn/api/public/Translates/Translate', JSON.stringify({
  //   text: 'xin chao'
  // }))
  // .then((response) => {
  //   console.log(response);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
  const sendAPI = _.debounce(async (input) => {
    setProcess("Đang dịch...");
    try {
      const res = await fetch(
        `${API}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        }
      );
      const content = await res.json();
      setResult(content.resultObj.tgt);
      setProcess("");
      setListen("");
    } catch (error) {}
  }, 1000);

  const [result, setResult] = useState("");
  const [process, setProcess] = useState(null);
  const [listen, setListen] = useState(null);
  const dataInput = useRef();

  const updateValue = useCallback((transcript) => {
    if (transcript !== "") sendAPI(transcript);
    document.getElementById("data").value = transcript;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    updateValue(transcript);
  }, [transcript, updateValue]);
  
  return (
    <div className="App">
      <Container>
        <h1>Dịch tiếng đồng bào dân tộc Bana <img className="vn" src="./vn.png" /></h1>
        <Row className="row-container">
          <Col className="vietnam d-flex justify-content-center">
            <textarea
              id="data"
              className="input"
              placeholder={listen || "Tiếng Việt"}
              onChange={(e) => {
                dataInput.current = e.target.value;
                sendAPI(e.target.value);
              }}
            ></textarea>
            <div className="text-icon">
              <FontAwesomeIcon
                onClick={()=> {SpeechRecognition.startListening(); setListen('Mời bạn nói')}}
                className={`voice ${listening ? 'voice-active':'' } `}
                icon={faMicrophone}
              ></FontAwesomeIcon>
            </div>
          </Col>
          <Col className="bana d-flex justify-content-center">
            <textarea
              placeholder={process || "Tiếng Bana"}
              readOnly
              value={result}
            ></textarea>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
