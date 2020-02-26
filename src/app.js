import React, { useEffect, useState } from 'react';

import { Window, App, Text, View, TouchableHighlight } from 'proton-native';
import { exec } from 'child_process';

const headerStyles = {
  fontSize: '30px',
  color: 'red',
  marginLeft: '50px',
};

const processStyle = {
  height: '50px',
};

const buttonStyle = {
  backgroundColor: 'red',
};

const Example = () => {
  const [processData, setProcessData] = useState([]);

  useEffect(() => {
    if (!processData.length) {
      fetchRunningProcesses();
    }
  }, []);

  function fetchRunningProcesses() {
    const command = `ps -o pid,user,%mem,%cpu,command ax | sort -b -k3 -r | awk '{print $1"|"$2"|"$3"|"$4"|"$5";"}'`;

    exec(command, (err, stdout, stderr) => {
      const processes = [];
      if (err) {
        console.error(err);
        return;
      }

      const lines = stdout.split(';');
      lines.shift();

      lines.forEach(data => {
        const splittedData = data.split('|');
        const parsedData = {
          PID: splittedData[0].trim(),
          user: splittedData[1],
          memory: splittedData[2],
          cpu: splittedData[3],
          name: splittedData[4],
        };
        processes.push(parsedData);
      });
      setProcessData(processes);
    });
  }

  return (
    <App>
      <Window style={{ width: 700, height: 768, backgroundColor: 'white' }}>
        <View>
          <Text style={processStyle}>aksjdhahdjk</Text>
          <TouchableHighlight style={{ backgroundColor: 'white' }} onPress={showAlert}>
            <Text style={buttonStyle}>Terminate</Text>
          </TouchableHighlight>
        </View>
      </Window>
    </App>
  );
};

export default Example;
