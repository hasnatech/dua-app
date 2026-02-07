<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Storage;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'otp',
        'otp_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // protected $appends = ['profile_completion'];

    public function getProfileCompletionAttribute()
    {
        $profileCompletion = 0;
        $candidate = $this->candidate;

        if ($candidate && $candidate->profile_summary) {
            $profileCompletion += 25;
        }
        if ($this->resumes()->exists()) {
            $profileCompletion += 25;
        }
        if ($candidate && $candidate->experiences()->exists()) {
            $profileCompletion += 25;
        }
        if ($candidate && $candidate->educations()->exists()) {
            $profileCompletion += 25;
        }

        return $profileCompletion;
    }

    public function resumes()
    {
        return $this->hasMany(Resume::class, 'candidate_id');
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function candidate()
    {
        return $this->hasOne(Candidates::class);
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function avatar_url()
    {
        return $this->avatar ? url($this->avatar) : null;
    }
}
