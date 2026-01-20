import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function LoadingScreen({ progress = 0 }) {

    const pct = Math.max(0, Math.min(100, Math.round(progress)));
    
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Loading... {pct}%</Text>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
        </View>
    );
}

const styles = {
    container: {
        width: '100%',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        color: '#333'
    },
    track: {
        width: '80%',
        height: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: '#F44322',
    }
};

export default LoadingScreen;