import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {useSelector} from "react-redux";
import {useHttp} from "../../hooks/http.hook";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {createReport} from "../reportList/reportListSlice";
import useApprovedStaff from "../../hooks/useApprovedStaff";

import {MyButton, MyInput, MySelect, MyTextArea} from "../UI";

import './reportform.sass';

const ReportForm = () => {

    const {isAuth} = useSelector(state => state.header);
    const [form, setForm] = useState({
        color: "",
        date: "",
        officer: "",
        description: ""
    });
    const [status, setStatus] = useState({error: false, submitError: false, isSubmit: false});
    const {request} = useHttp();
    const dispatch = useDispatch();

    const onEditTextArea = (event) => {
        setForm({...form, description: event.target.value});
    };

    const approvedStaff = useApprovedStaff();

    const selectOptions = [
        {name: "Обычный", value: "general"},
        {name: "Спортивный", value: "sport"},
    ];

    return (
        <Formik
            initialValues={{licenseNumber: "", ownerFullName: "", type: ""}}
            validationSchema={Yup.object({
                licenseNumber: Yup.string().required("* Обязательное поле"),
                ownerFullName: Yup.string().required("* Обязательное поле"),
                type: Yup.string().required("* Обязательное поле")
            })}
            onSubmit={values => {

                const url = isAuth
                ? "https://sf-final-project-be.herokuapp.com/api/cases/"
                : "https://sf-final-project-be.herokuapp.com/api/public/report";

                const body = isAuth
                ? {...values, ...form}
                : {...values, ...form, clientId: "9ca0a019-ef07-495d-a440-0a95468cce39"};

                request(url, "POST", JSON.stringify(body))
                    .then(data => {
                        setForm({color: "",date: "",officer: "",description: ""});
                        setStatus({...status, error: false, submitSuccess: true, isSubmit: true});
                        dispatch(createReport(data.data));
                    })
                    .catch(error => {
                        console.log(error);
                        setStatus({...status, error: true, submitError: true, isSubmit: true});
                    });
            }}
        >
            <Form className="report-page_form">
                <div className="report-page_id">
                    <div className="report-page_field">Номер лицензии</div>
                    <Field name="licenseNumber">
                        {({ field, meta }) => (
                            <>
                                <MyInput {...field} placeholder="Введите номер лицензии"/>
                                {meta.touched && meta.error && <div className="form_error">{meta.error}</div>}
                            </>
                        )}
                    </Field>
                </div>
                <div className="report-page_name">
                    <div className="report-page_field">ФИО клиента</div>
                    <Field name="ownerFullName">
                        {({ field, meta }) => (
                            <>
                                <MyInput {...field} placeholder="Введите фио клиента"/>
                                {meta.touched && meta.error && <div className="form_error">{meta.error}</div>}
                            </>
                        )}
                    </Field>
                </div>
                <div className="report-page_select">
                    <div className="report-page_field">Выбретие тип велосипеда</div>
                    <Field name="type">
                        {({ field, meta }) => (
                            <>
                                <MySelect defaultValue="Выбрать тип" selectOptions={selectOptions} name="type" {...field}/>
                                {meta.touched && meta.error && <div className="form_error">{meta.error}</div>}
                            </>
                        )}
                    </Field>
                </div>
                <div className="report-page_color">
                    <div className="report-page_field">Цвет велосипеда</div>
                    <MyInput
                        value={form.color}
                        onChange={event => setForm({...form, color: event.target.value})}
                        placeholder="Введите цвет велосипеда"
                    />
                </div>
                <div className="report-page_date">
                    <div className="report-page_field">Выберите дату</div>
                    <MyInput
                        value={form.date}
                        onChange={event => setForm({...form, date: event.target.value})}
                        type="date"
                    />
                </div>
                <div className="report-page_info">
                    <div className="report-page_field">Дополнительная информация</div>
                    <MyTextArea
                        value={form.description}
                        callback={onEditTextArea}
                    />
                </div>
                {isAuth
                ? <div className="report-page_staff">
                        <div className="report-page_field">Выбрать сотрудника</div>
                        <MySelect
                            onChange={(event) => setForm({...form, officer: event.target.value})}
                            defaultValue="Выбрать сотрудника"
                            selectOptions={approvedStaff}
                        />
                    </div>
                : null
                }
                <div className="report-page_submit">
                    <MyButton type="submit">Отправить</MyButton>
                </div>
                <div className={status.isSubmit ? "report-page_message active" : "report-page_message"}>
                    {status.submitError
                        ? "Ошибка отправки данных на сервер"
                        : <div className="report-page_message_success">Успешно</div>}
                </div>
            </Form>
        </Formik>
    )
}

export default ReportForm;