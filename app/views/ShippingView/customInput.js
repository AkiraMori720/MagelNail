import React from 'react';
import {Text, TextInput, View} from 'react-native';
import styles from './styles';

const CustomTextInput = React.memo(({inputRef, label, value, type, placeholder, onChange, onSubmitEditing, multiline}) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            ref={inputRef}
            style={type==='textarea'?styles.textarea:styles.input}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onSubmitEditing={onSubmitEditing}
            multiline={multiline}
        />
    </View>
))

export default CustomTextInput;
