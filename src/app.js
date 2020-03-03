import React, { useEffect, useState } from 'react'

import {
  Window,
  App,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'proton-native'
import { exec } from 'child_process'

const processStyle = {
  marginLeft: '24px',
}

const buttonStyle = {
  backgroundColor: 'red',
  textAlign: 'center',
}

const headerStyles = {
  backgroundColor: '#9ea6ac',
  margin: '24px',
}

const Example = () => {
  const [processData, setProcessData] = useState([])

  useEffect(() => {
    if (!processData.length) {
      fetchRunningProcesses()
    }
  }, [])

  function fetchRunningProcesses() {
    const command = `ps -o pid,user,%mem,%cpu,command ax | sort -b -k3 -r | awk '{print $1"|"$2"|"$3"|"$4"|"$5";"}'`

    exec(command, (err, stdout, stderr) => {
      const processes = []
      if (err) {
        console.error(err)
        return
      }

      const lines = stdout.split(';')
      lines.shift()

      lines.forEach(data => {
        const splittedData = data.split('|')
        const parsedData = {
          PID: splittedData[0].trim(),
          user: splittedData[1],
          memory: splittedData[2],
          cpu: splittedData[3],
          name: splittedData[4],
        }
        processes.push(parsedData)
      })
      setProcessData(processes)
    })
  }

  function logPID(value) {
    console.log(value)
  }

  function renderProcesses() {
    if (!processData.length) return

    return processData.map((data, index) => {
      return (
        <View
          style={{
            padding: '24px',
            flexDirection: 'row',
            width: '100%',
          }}
          key={index}
        >
          <Text style={processStyle}>{data.PID}</Text>
          <Text style={processStyle}>{data.user}</Text>
          <Text style={processStyle}>{data.memory}</Text>
          <Text style={processStyle}>{data.cpu}</Text>
          <Text style={processStyle}>{data.name}</Text>
          <TouchableHighlight
            style={{ backgroundColor: 'white', maxWidth: '100px' }}
            onPress={() => logPID(data.PID)}
          >
            <Text style={buttonStyle}>Terminate</Text>
          </TouchableHighlight>
        </View>
      )
    })
  }

  return (
    <App>
      <Window
        style={{
          minWidth: 700,
          minHeight: 768,
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            background: '#9ea6ac',
          }}
        >
          <Text style={headerStyles}>PID</Text>
          <Text style={headerStyles}>User</Text>
          <Text style={headerStyles}>Memory %</Text>
          <Text style={headerStyles}>CPU %</Text>
          <Text style={headerStyles}>Process Name</Text>
        </View>
        {renderProcesses()}
      </Window>
    </App>
  )
}

export default Example
