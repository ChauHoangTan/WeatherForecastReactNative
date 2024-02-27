import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { MagnifyingGlassIcon, MapPinIcon, SunIcon, CalendarDaysIcon } from "react-native-heroicons/outline";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import axios from 'axios'

// const searchResults = ["Ho Chi Minh, Viet Nam","Ho Chi Minh, Viet Nam","Ho Chi Minh, Viet Nam",
// "Ho Chi Minh, Viet Nam","Ho Chi Minh, Viet Nam","Ho Chi Minh, Viet Nam",
// "Ho Chi Minh, Viet Nam","Ho Chi Minh, Viet Nam","Ho Chi Minh, Viet Nam"]

const LocationSearch = ({ location }) => {
    return (
        <View style={styles.locationSearch}>
            <MapPinIcon color={"black"} size={20}/>
            <Text style={styles.text}>
                {location}
            </Text>
        </View>
    )
}

const SearchResult = ({ results, setTextSearch, setSearchValue, setIsOpeningSearch}) => {

    const handlePress = (value) => {
        setSearchValue(value)
        setTextSearch(value)
        setIsOpeningSearch(false)
    }

    return (
        <ScrollView 
            showsVerticalScrollIndicator={true}
            style={styles.searchResult}>
                {
                    results.map((item, index) => {
                        return (
                            <TouchableOpacity key={index}
                                onPress={ () => handlePress(`${item.name}, ${item.country}`)}>
                                <LocationSearch location={`${item.name}, ${item.country}`}/>
                                {
                                    index < results.length -1  && <View style={styles.seperateSearch}></View>
                                }
                                
                            </TouchableOpacity>
                        )
                    })
                }
        </ScrollView>
    )
}

const DateForecast = ({date, icon, tempo}) => {
    return ( 
        <View style={{display: 'flex', width: 100, flexDirection: 'column', alignItems:'center', backgroundColor: 'rgba(231, 230, 231, 0.3)',
            borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5}}>
            <Image
                source={{
                    uri: `https:${icon}`
                }}
                style={{width: 60, height: 60}}/>
            <Text style={{color: "white"}}>{date}</Text>
            <Text style={{color: "white"}}>{tempo}&#176;C</Text>
        </View>
    )
}

const convertDateToWeekday = (date) => {
    const dateObj = new Date(date)
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const weekday = weekdays[dateObj.getDay()]
    return weekday
}

const convertTimeToHour = (time) => {
    return time.substr(-5)
}
 
function Home() {

    const [textSearch, setTextSearch] = useState('')
    const [searchValue, setSearchValue] = useState('Ho Chi Minh')

    const [isOpeningSearch, setIsOpeningSearch] = useState(false)
    const [currentWeather, setCurrentWeather] = useState(null)

    const [searchResults, setSearchResults] = useState([])

    useEffect(  () => {
        const fetchCurrentWeather = async () => {
            const respond = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=0be84ed3bec040c19e4163856242301&q=${searchValue}&days=7&aqi=no&alerts=no`)
            setCurrentWeather(respond.data)
        } 
        fetchCurrentWeather()
    }, [searchValue])

    useEffect( () => {
        const fetchAutoComplete = async () => {
            if (textSearch != ''){
                const respond = await axios.get(`http://api.weatherapi.com/v1/search.json?key=0be84ed3bec040c19e4163856242301&q=${textSearch}`)
                setSearchResults(respond.data)
            }
        }
        fetchAutoComplete()
    }, [textSearch])

    const handleShowSearch = () => {
        setIsOpeningSearch(!isOpeningSearch)
    }

    const wrapSearchStyle = {
        backgroundColor: isOpeningSearch ? 'rgba(217, 207, 212, 0.52)' : 'rgba(217, 207, 212, 0)',
    }

    return ( 
        <View>
            {
                currentWeather != null ? 
                <View style={styles.container}>
                    <StatusBar/>
                    <Image
                        style={styles.bgImage}
                        source={{
                            uri: 'https://w.forfun.com/fetch/90/905b95babe422c39b812ac3202140e2f.jpeg'
                        }}
                        blurRadius={20}/>
                    
                    <View style={styles.contentSearch}>
                        <View style={[styles.wrapSearch, wrapSearchStyle]}>
                            <View style={styles.containerSearch}>
                                {
                                    isOpeningSearch ? 
                                    <TextInput
                                        placeholder='Search...'
                                        value={textSearch}
                                        onChangeText={text => setTextSearch(text)}
                                        style={[styles.inputTextSearch]}

                                    /> : null
                                }
                                
                                <TouchableOpacity
                                style={styles.searchBtn}
                                    onPress={handleShowSearch}>
                                        <MagnifyingGlassIcon size={25} color={'white'}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    
                        {
                            isOpeningSearch ? 
                            <SearchResult results={searchResults} setSearchValue={setSearchValue} setTextSearch={setTextSearch} setIsOpeningSearch={setIsOpeningSearch}/>
                                : null
                        }
                        
                    </View>
                    
                    {/* Forecast section */}
                    {
                        !isOpeningSearch && 
                        <View style={styles.forecast}>
                            <Text style={{color:'white', fontSize: 16}}><Text style={{fontSize: 18, fontWeight:'bold'}}>{currentWeather.location.name}, </Text>{currentWeather.location.country}</Text>

                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Image
                                    source={{
                                        uri: `https:${currentWeather.current.condition.icon}`
                                    }}
                                    style={styles.currentWeatherIcon}/>
                                <Text style={{color:'white', fontSize: 45, fontWeight:'bold'}}>{currentWeather.current.temp_c}&#176;C</Text>
                                <Text style={{color:'white', marginTop: 5, fontWeight: '300'}}>{currentWeather.current.condition.text}</Text>
                            </View>

                            <View style={styles.containIcons}>
                                <View style={styles.containIcon}>
                                    <IconFeather name="wind" size={20} color="white" />
                                    <Text style={{color: 'white', marginLeft: 5}}>{currentWeather.current.wind_kph}km/h</Text>
                                </View>

                                <View style={styles.containIcon}>
                                    <IconEntypo name="drop" size={20} color="white" />
                                    <Text style={{color: 'white'}}>{currentWeather.current.humidity}%</Text>
                                </View>

                                <View style={styles.containIcon}>
                                    <SunIcon size={20} color={'white'}/>
                                    <Text style={{color: 'white'}}>6:05AM</Text>
                                </View>
                            </View>

                            <View style={styles.dailyForecast}>
                                <View style={styles.dailyIcon}>
                                    <CalendarDaysIcon size={20} color={'white'}/>
                                    <Text style={{color: 'white', marginLeft: 10}} >Daily forecast</Text>
                                </View>

                                <ScrollView 
                                    style={{marginTop: 10}}
                                    horizontal>
                                    {
                                        currentWeather.forecast.forecastday[0].hour.map((item, index) => {
                                            return <DateForecast date={(convertTimeToHour(item.time))} icon={item.condition.icon} tempo={item.temp_c} key={index}/>
                                        })
                                    }
                                    
                                    {
                                       currentWeather.forecast.forecastday.slice(1).map((item, index) => {
                                            return <DateForecast date={(convertDateToWeekday(item.date))} icon={item.day.condition.icon} tempo={item.day.avgtemp_c} key={index}/>
                                       })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    }
                    
                </View> : null
            }
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },  
    text: {
        fontSize: 25,
        color: 'white'
    },
    bgImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    contentSearch: {
        marginHorizontal: 10,
        position: 'absolute',
        width: '95%',
        zIndex: 1
    },
    wrapSearch: {
        height: 50,
        marginTop: 5,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    containerSearch: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    inputTextSearch: {
        flex: 1,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        color: 'white',
    },
    searchBtn: {
        padding: 10,
        marginEnd: 3,
        borderRadius: 50,
        backgroundColor: 'rgba(240, 240, 232, 0.42)'
    },
    locationSearch: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 16,
        marginLeft: 10
    },
    searchResult: {
        backgroundColor: "rgba(230, 230, 230, 1)",
        marginTop: 5,
        borderRadius: 20,
        paddingHorizontal: 10,
        maxHeight: 250,
    },
    seperateSearch: {
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(150, 150, 150, 1)'
    },
    forecast: {
        display: 'flex',
        marginHorizontal: 10, 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '95%',
        height: '100%',
    },
    textForecast: {
        color: 'white'
    },
    currentWeatherIcon: {
        width: 150,
        height: 150
    },
    containIcons: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-around',
        justifyContent: 'space-around',
        width: '100%'
    },
    containIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageIcon: {
        width: 100,
        height: 100,
    },
    imageIconDrop: {
        width: 25,
        height: 25,
    },
    dailyIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dailyForecast: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }
})

export default Home;