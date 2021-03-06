// Antd dependencies
import { Avatar, Menu } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// Local files
import { persistor } from '@/redux/store'
import { API_URL } from '@/../config/constants'
import HeaderDropdown from '../HeaderDropdown'
import './style.less'


const AvatarDropdown = () => {
	const router = useRouter()
	const user = useSelector((state: any) => state.user?.attributes.user)

	const handleSignOut = async (): Promise<void> => {
		await persistor.purge()
		location.reload()
	}

	const menuHeaderDropdown = (
		<Menu className={'menu'}>
			<Menu.Item onClick={() => router.push('/user/[username]', `/user/${user.username}`)} key="/">
				<UserOutlined />
				Profile
			</Menu.Item>

			<Menu.Item onClick={() => router.push('/settings')} key="/settings">
				<SettingOutlined />
				Settings
			</Menu.Item>

			<Menu.Item onClick={handleSignOut} key="/logout">
				<LogoutOutlined />
				Sign Out
			</Menu.Item>
		</Menu>
	)

	return (
		<HeaderDropdown trigger={['click']} overlay={menuHeaderDropdown}>
			<span className={'action account'}>
				<Avatar size="small" className={'avatar'} src={`${API_URL}/v1/user/pp?username=${user.username}`} alt="User Image" />
				<span className={'name'}>{user.full_name.split(' ')[0]}</span>
			</span>
		</HeaderDropdown>
	)
}
export default AvatarDropdown
