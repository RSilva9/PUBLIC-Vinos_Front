import { apiUrl } from '../config/config';
import type { Client } from '../utils/interfaces';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, type SelectChangeEvent, ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { EmailEditor, type EditorRef, type EmailEditorProps } from 'react-email-editor';
import Swal from 'sweetalert2';
import wretch from 'wretch';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from './themeContext';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const EmailBuilder: React.FC = ()=>{
    const [clients, setClients] = useState<Client[]>([]);
    const emailEditorRef = useRef<EditorRef>(null);
    const [templates, setTemplates] = useState<{templateName: string, templateData: any}[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
    const { theme } = useTheme();

    const saveTemplate = async()=>{
        Swal.fire({
            title: '¿Con qué nombre querés guardar la plantilla?',
            input: 'text',
            confirmButtonText: 'Guardar'
        }).then(async(result)=>{
            if(result.isConfirmed){
                const name = result.value; 
                if(name){
                    emailEditorRef.current?.editor?.saveDesign(async (design: any) => {
                        await wretch(`${apiUrl}/mensajeria/guardar-plantilla`)
                            .options({ credentials: 'include' })
                            .post({ templateData: design, templateName: name });
                        toast("Plantilla guardada correctamente");
                        await fetchTemplates();
                    });
                }else{
                    Swal.fire('Error', 'Debés ingresar un nombre para la plantilla.', 'error');
                }
            }
        });
    };

    const fetchTemplates = async()=>{
        const templates = await wretch(`${apiUrl}/mensajeria/lista-de-plantillas`)
            .options({credentials: 'include'})
            .get()
            .json<any>();
        setTemplates(templates);
    }

    const fetchClients = async()=>{
        const response = await wretch(`${apiUrl}/clientes/lista-de-clientes`)
            .options({ credentials: "include" })
            .get()
            .json<any>();
        setClients(response);
    }

    const loadTemplate = (templateName: string)=>{
        const template = templates.find(temp => temp.templateName === templateName);
        if(template){
            emailEditorRef.current?.editor?.loadDesign(template.templateData);
        }else{
            emailEditorRef.current?.editor?.loadBlank()
        }
    }

    useEffect(()=>{
        fetchTemplates();
        fetchClients();
    }, [])

    const sendMail = ()=>{
        try {
            emailEditorRef.current?.editor?.exportHtml(async(data)=>{
                const { html } = data;
                await wretch(`${apiUrl}/mensajeria/enviar-correo`)
                    .options({ credentials: 'include' })
                    .post({recipients: selectedClients, emailData: html});
                toast("Correo enviado correctamente");
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error...",
                text: "Ocurrió un error al enviar el correo",
            });
        }
        
    };

    const onReady: EmailEditorProps['onReady'] = ()=>{
        console.log('Editor cargado');
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            },
        },
    };

    const handleChange = (event: SelectChangeEvent<typeof selectedClients>) => {
        const {
            target: { value }, 
        } = event;
    
        setSelectedClients(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <div style={{ minHeight: '800px' }}>
            <ToastContainer />
            <EmailEditor
                ref={emailEditorRef}
                onReady={onReady}
                minHeight="800px"
                projectId={276777}
                options={{
                    locale: 'es-ES',
                }}
            />
            <div className='mt-5 mb-3 flex justify-between text-white dark:text-gray-100'>
                <div className='flex w-1/2'>
                    <div className='w-1/2'>
                        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>    
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Plantillas</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedTemplate}
                                    label="Plantillas"
                                    onChange={(event) => {
                                        const newValue = event.target.value as string;
                                        setSelectedTemplate(newValue);
                                        loadTemplate(newValue);
                                    }}
                                    >
                                        <MenuItem value={''}>Elegir una plantilla</MenuItem>
                                    {
                                        templates 
                                        ?
                                        templates.map((temp, index)=> 
                                            <MenuItem key={index} value={temp.templateName}>{temp.templateName}</MenuItem>
                                        )
                                        :
                                        <MenuItem value="" disabled>
                                            No hay plantillas disponibles
                                        </MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                    <button 
                    className="mx-2 cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                    onClick={saveTemplate}
                    style={{minHeight: '56px'}}
                    >
                        Guardar Diseño
                    </button>
                </div>
                <div>
                    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
                        <FormControl sx={{ width: 300, mx: 1 }}>
                            <InputLabel id="selectClientes-label">Clientes</InputLabel>
                            <Select
                                labelId="selectClientes"
                                id="selectClientes"
                                multiple
                                value={selectedClients}
                                onChange={handleChange}
                                input={<OutlinedInput label="Clientes" />}
                                renderValue={(selected) =>
                                    clients
                                        .filter(c => selected.includes(c.email))
                                        .map(c => c.name)
                                        .join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                            {clients.map((client) => (
                                <MenuItem key={client.id} value={client.email}>
                                    <Checkbox checked={selectedClients.includes(client.email)} />
                                    <ListItemText primary={client.name} />
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                    <button 
                    className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                    onClick={sendMail}
                    style={{minHeight: '56px'}}
                    >
                        Enviar correo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailBuilder;