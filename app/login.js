import { View, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomTextInput from './components/customTextInput'
import { router } from 'expo-router'
import { useTheme } from './providers/theme_provider'
import { colors, themeColors } from './themes/colors'
import CustomButton from './components/customButton'
import * as SecureStore from 'expo-secure-store';

const LoginScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({})
    const { theme } = useTheme();

    const usernameValue = 'username';
    const passwordValue = 'SDDpassword123!';

    const shiftEncrypt = (text, shift) => {
        let result = '';
        for (const char of text) {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
            } else {
                result += char;
            }
        }
        return result;
    };

    const getPokemon = async() => {
        const { data } = await axios.get(`${API_URL}/pokemon`)
        
        data.forEach((value, key) => {
            const types = value.type.join(" - ")
            const group =  pokemonByGroups.find((value) => value.type == types)
            if(group == null) {
                pokemonByGroups.push({
                    type: types,
                    data: [ value ]
                })
            } else if(group.data.findIndex(data => data.id == value.id) < 0){
                group.data.push(value)
            }
        });  
         
        setPokemons(pokemonByGroups)
        setLoading(false);
    };

    const downloadPokemonSun = async (imageURI) => {
        const imagesDirUri = '../assets/images';
        await FileSystem.makeDirectoryAsync(imagesDirUri, { intermediates: true });
        const fileUri = imageURI;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
        console.log('fileInfo:', fileInfo);
        setPokemonSun(fileInfo.uri);
        } else {
        const { uri } = await FileSystem.downloadAsync(
        '...',
        fileUri
        );
        console.log('uri:', uri);
        setPokemonSun(uri);
        }
    };

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem('pokemonList', jsonValue);
        } catch (e) {s
          d
        }
      };

    const shiftDecrypt = (text, shift) => {
        return shiftEncrypt(text, 26 - shift);
    };

    React.useEffect(() => {
        const passwordHash = async () => {
        const hash = shiftDecrypt(passwordValue,13);
        SecureStore.setItemAsync('password', hash);
        };
        passwordHash();
    });

    const onLogin = () => {
        const error = {}

        // if(username == '') {
        //     error.username = 'No username'
        // } 

        // if(password == '') {
        //     error.password = 'No password'
        // }
        
        // if((username != '' && username != usernameValue) || (password != '' && password != passwordValue)) {
        //     error.password = 'Invalid password'
        // } 
        
        
        if(Object.keys(error).length == 0) {
            router.replace('pokedex/(tabs)')
        } else {
            setError(error)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.container, { backgroundColor: themeColors[theme].container}]}>
                <View style={{ marginHorizontal: 20}}>
                <Image source={require('../assets/pokemon-mastermind-of.png')} style={{ resizeMode: 'contain',width: 500, height: 180, margin: 'auto'}} />
                <CustomTextInput value={username} onValueChange={(value) => setUsername(value)} title='Username' error={error.username}/>
                <CustomTextInput value={password} onValueChange={(value) => setPassword(value)} title='Password' secureTextEntry={true} error={error.password}/>
                <CustomButton 
                    text={'LOGIN'} 
                    backgroundColor={colors.green}
                    icon={'right-to-bracket'}
                    btnStyle={{ marginTop: 20 }}
                    onPress={onLogin}
                />
                </View>
                
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%',
        width: '100%'
    }
})

export default LoginScreen