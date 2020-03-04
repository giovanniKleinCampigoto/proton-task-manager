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
  flex: 1,
  textAlign: 'center',
}

const buttonStyle = {
  textAlign: 'center',
  margin: '24px',
  border: 0,
}

const headerStyles = {
  margin: '24px',
  flexBasis: 0,
  flexGrow: 1.5,
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'elipsis',
  fontWeight: 'bold',
  color: 'white',
}

const Example = () => {
  const [processData, setProcessData] = useState([])

  useEffect(() => {
    if (!processData.length) {
      refreshProcesses()
    }
  }, [])

  function refreshProcesses() {
    setInterval(() => {
      fetchRunningProcesses()
    }, 2000)
  }

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
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: '#EBEFF4',
            padding: '16px',
          }}
          key={index}
        >
          <Text style={processStyle}>{data.PID}</Text>
          <Text style={processStyle}>{data.user}</Text>
          <Text style={processStyle}>{data.memory}</Text>
          <Text style={processStyle}>{data.cpu}</Text>
          <Text style={{ ...processStyle, marginRight: '16px' }}>
            {data.name}
          </Text>
          <TouchableHighlight
            style={{
              backgroundColor: '#6b75aa',
              textAlign: 'center',
              flex: 1,
              justifyContent: 'center',
              borderRadius: '4px',
              height: '42px',
            }}
            onPress={() => logPID(data.PID)}
          >
            <Text style={buttonStyle}>Kill</Text>
          </TouchableHighlight>
        </View>
      )
    })
  }

  return (
    <App>
      <Window
        style={{
          minWidth: 1024,
          minHeight: 768,
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            background: '#24292E',
            overflow: 'scroll',
          }}
        >
          <Text style={headerStyles}>PID</Text>
          <Text style={headerStyles}>User</Text>
          <Text style={headerStyles}>Memory %</Text>
          <Text style={headerStyles}>CPU %</Text>
          <Text style={headerStyles}>Process Name</Text>
          <Text style={headerStyles}></Text>
        </View>
        {renderProcesses()}
      </Window>
    </App>
  )
}

export default Example
